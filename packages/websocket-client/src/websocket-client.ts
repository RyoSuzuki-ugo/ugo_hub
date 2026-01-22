/**
 * WebSocketクライアント接続モジュール
 * UGOポータルシステムのリアルタイム通信用WebSocketクライアント
 */

export class WebSocketClient {
  protected ws: WebSocket;
  protected messageHandlers: ((evt: MessageEvent) => void)[] = [];
  protected errorHandlers: ((evt: Event) => void)[] = [];
  protected closeHandlers: ((evt: CloseEvent) => void)[] = [];

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  /**
   * WebSocketクライアントを作成
   * @param options - 接続オプション
   * @returns WebSocketクライアントのインスタンス
   */
  static create(options: {
    url: string;
    realm: 'robot' | 'operator' | 'service';
    token: string;
    socket?: WebSocket;
  }): Promise<WebSocketClient> {
    return new Promise((resolve, reject) => {
      const ws = options.socket ?? new WebSocket(options.url);

      ws.onopen = async () => {
        const client =
          options.realm === 'robot'
            ? new RobotClient(ws)
            : new UserClient(ws);

        if (options.token == null) {
          resolve(client);
          return;
        }

        console.debug('[WebSocketClient] Sending auth message', options.token);
        client.authorize(options.token, options.realm);
        const res = await client.waitForMessage();

        if (res?.c === 'res' && res.result === 'OK') {
          console.debug('[WebSocketClient] Authorization successful');
          resolve(client);
        } else {
          console.error('[WebSocketClient] Authorization failed', res);
          reject(new Error('Authorization failed'));
          ws.close();
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocketClient] Connection error', error);
        reject(error);
      };
    });
  }

  /**
   * 認証リクエストを送信
   * @param token - 認証トークン
   * @param realm - realm (robot, operator, service)
   */
  authorize(token: string, realm: string): void {
    const authRequest = {
      m: 'websocket',
      c: 'authorize',
      realm: realm,
      token,
    };
    this.ws.send(JSON.stringify(authRequest));
  }

  /**
   * メッセージを待機
   * @param timeout - タイムアウト時間（ミリ秒）
   * @returns 受信したメッセージ、またはタイムアウト時null
   */
  waitForMessage(timeout = 3000): Promise<any | null> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.ws.removeEventListener('message', messageHandler);
        resolve(null);
      }, timeout);

      const messageHandler = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          clearTimeout(timeoutId);
          resolve(message);
        } catch (e) {
          console.error('[WebSocketClient] Error parsing message', e);
        } finally {
          this.ws.removeEventListener('message', messageHandler);
        }
      };

      this.ws.addEventListener('message', messageHandler);
    });
  }

  /**
   * イベントリスナーを登録
   * @param event - イベント名 (message, error, close)
   * @param listener - リスナー関数
   */
  on(
    event: 'message',
    listener: (data: string, binary?: boolean) => void
  ): void;
  on(event: 'error', listener: (error: Event) => void): void;
  on(event: 'close', listener: (event: CloseEvent) => void): void;
  on(event: string, listener: any): void {
    if (event === 'message') {
      const handler = (evt: MessageEvent) =>
        listener(evt.data, evt.data instanceof ArrayBuffer);
      this.messageHandlers.push(handler);
      this.ws.addEventListener(event, handler);
    } else if (event === 'error') {
      this.errorHandlers.push(listener);
      this.ws.addEventListener(event, listener);
    } else if (event === 'close') {
      this.closeHandlers.push(listener);
      this.ws.addEventListener(event, listener);
    }
  }

  /**
   * WebSocket接続を閉じる
   */
  close(): void {
    this.ws.close();
  }

  /**
   * 生のメッセージを送信
   * @param message - 送信するメッセージオブジェクト
   */
  sendRaw(message: any): void {
    this.ws.send(JSON.stringify(message));
  }

  /**
   * 接続状態を取得
   * @returns WebSocketの接続状態
   */
  getReadyState(): number {
    return this.ws.readyState;
  }

  /**
   * 接続が開いているかチェック
   * @returns 接続が開いている場合true
   */
  isConnected(): boolean {
    return this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * ロボット用WebSocketクライアント
 */
export class RobotClient extends WebSocketClient {
  /**
   * トピックにデータを公開
   * @param topic - トピック名
   * @param serial - ロボットシリアル番号
   * @param data - 公開するデータ
   */
  publish(topic: string, serial: string, data: any): void {
    const command = {
      m: 'websocket',
      c: 'publish',
      topic,
      robot_serial_no: serial,
      data,
    };
    this.ws.send(JSON.stringify(command));
  }
}

/**
 * ユーザー（オペレーター/サービス）用WebSocketクライアント
 */
export class UserClient extends WebSocketClient {
  /**
   * 最新のトピックデータを再公開
   * @param topic - トピック名
   * @param serial - ロボットシリアル番号
   */
  republish(topic: string, serial: string): void {
    const command = {
      m: 'websocket',
      c: 'republish',
      topic,
      robot_serial_no: serial,
      ts: Date.now(),
      id: crypto.randomUUID(),
    };
    this.ws.send(JSON.stringify(command));
  }

  /**
   * トピックを購読
   * @param topics - トピック名（配列または文字列）
   * @param serial - ロボットシリアル番号
   */
  subscribe(topics: string | string[], serial: string): void {
    const command = {
      m: 'websocket',
      c: 'subscribe',
      topics: Array.isArray(topics) ? topics : [topics],
      robot_serial_no: serial,
      id: crypto.randomUUID(),
    };
    this.ws.send(JSON.stringify(command));
  }

  /**
   * トピックの購読を解除
   * @param topics - トピック名（配列または文字列）
   * @param serial - ロボットシリアル番号
   */
  unsubscribe(topics: string | string[], serial: string): void {
    const command = {
      m: 'websocket',
      c: 'unsubscribe',
      topics: Array.isArray(topics) ? topics : [topics],
      robot_serial_no: serial,
      id: crypto.randomUUID(),
    };
    this.ws.send(JSON.stringify(command));
  }

  /**
   * トピック設定を更新
   * @param topic - トピック名
   * @param serial - ロボットシリアル番号
   * @param data - トピック設定データ
   */
  setTopicConf(
    topic: string,
    serial: string,
    data: {
      latency?: number;
      count?: number;
      meta?: any;
      heartbeat?: boolean;
    }
  ): void {
    const command = {
      m: 'websocket',
      c: 'set_topic_conf',
      topic,
      robot_serial_no: serial,
      data,
      id: crypto.randomUUID(),
    };
    this.ws.send(JSON.stringify(command));
  }

  /**
   * トピック設定を取得
   * @param topic - トピック名
   * @param serial - ロボットシリアル番号
   */
  getTopicConf(topic: string, serial: string): void {
    const command = {
      m: 'websocket',
      c: 'get_topic_conf',
      topic,
      robot_serial_no: serial,
      id: crypto.randomUUID(),
    };
    this.ws.send(JSON.stringify(command));
  }

  /**
   * アクションコマンドを実行
   * @param serial - ロボットシリアル番号
   * @param command - アクションコマンド
   * @param id - コマンドID（オプション）
   */
  executeActionCommand(serial: string, command: any, id?: string): void {
    const commandMessage = {
      m: 'websocket',
      c: 'command',
      id: id || crypto.randomUUID(),
      ts: Date.now(),
      robot_serial_no: serial,
      data: command,
    };
    this.ws.send(JSON.stringify(commandMessage));
  }
}
