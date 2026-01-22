import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { Button } from '@repo/shared-ui/components/button';
import { Input } from '@repo/shared-ui/components/input';
import { Label } from '@repo/shared-ui/components/label';
import { Textarea } from '@repo/shared-ui/components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/shared-ui/components/select';
import { Alert, AlertDescription } from '@repo/shared-ui/components/alert';
import { Badge } from '@repo/shared-ui/components/badge';
import { Wifi, WifiOff, Loader2, Eye, EyeOff, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import {
  WebSocketClient,
  RobotClient,
  UserClient,
  getEnvironment,
  getWebSocketEndpoint,
  type Environment
} from '@repo/websocket-client';

type Realm = 'operator' | 'robot' | 'service';
type MessageType = 'info' | 'sent' | 'received' | 'error';

interface Message {
  timestamp: string;
  text: string;
  type: MessageType;
}

function getEnvColor(env: Environment): string {
  switch (env) {
    case 'LOCAL':
      return 'bg-orange-500';
    case 'TEST':
      return 'bg-yellow-500';
    case 'DEV':
      return 'bg-red-500';
    case 'STG':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

export function WebSocketTestPage() {
  const [env] = useState<Environment>(getEnvironment());
  const [wsUrl, setWsUrl] = useState('');
  const [realm, setRealm] = useState<Realm>('operator');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Operator operations
  const [robotSerial, setRobotSerial] = useState('UM01AA-A294X0006');
  const [topics, setTopics] = useState('system.data.main');
  const [commandJson, setCommandJson] = useState('');

  // Robot operations
  const [publishTopic, setPublishTopic] = useState('status');
  const [publishSerial, setPublishSerial] = useState('');
  const [publishData, setPublishData] = useState('');

  // Message log
  const [messages, setMessages] = useState<Message[]>([]);
  const messageLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultUrl = getWebSocketEndpoint(env);
    setWsUrl(defaultUrl);
    log(`環境: ${env}`, 'info');
    log(`自動設定されたURL: ${defaultUrl}`, 'info');

    // Try to get token from localStorage
    const userToken = localStorage.getItem('user-token');
    if (userToken) {
      setToken(userToken);
      log('認証トークンを自動設定しました (local-storage: user-token)', 'info');
    } else {
      log('認証トークンが見つかりませんでした。手動で入力してください。', 'info');
    }

    log('接続設定を入力して「接続」ボタンを押してください', 'info');

    return () => {
      if (client) {
        client.close();
      }
    };
  }, []);

  useEffect(() => {
    if (messageLogRef.current) {
      messageLogRef.current.scrollTop = messageLogRef.current.scrollHeight;
    }
  }, [messages]);

  const log = (text: string, type: MessageType = 'info') => {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    setMessages(prev => [...prev, { timestamp, text, type }]);
  };

  const clearLog = () => {
    setMessages([]);
    log('ログをクリアしました', 'info');
  };

  const connect = async () => {
    if (!wsUrl || !token) {
      log('URLとトークンを入力してください', 'error');
      return;
    }

    setIsConnecting(true);
    log(`WebSocket接続開始: ${wsUrl}`, 'info');
    log(`Realm: ${realm}`, 'info');

    try {
      const newClient = await WebSocketClient.create({
        url: wsUrl,
        realm,
        token,
      });

      // Message handler
      newClient.on('message', (data: string) => {
        try {
          const message = JSON.parse(data);
          log(`受信: ${JSON.stringify(message, null, 2)}`, 'received');

          // Auto-respond to flow_start for robots
          if (realm === 'robot' && message.c === 'flow_start') {
            const response = {
              m: 'flow',
              c: 'flow_done',
              ts: Date.now(),
              id: message.id,
              robot_serial_no: message.robot_serial_no,
              params: { status: 'ok' },
            };
            setTimeout(() => {
              newClient.sendRaw(response);
              log(`送信: ${JSON.stringify(response, null, 2)}`, 'sent');
            }, 100);
          }
        } catch (e) {
          log(`メッセージパースエラー: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
      });

      newClient.on('error', (error: any) => {
        log(`WebSocketエラー: ${error}`, 'error');
        setIsConnected(false);
      });

      newClient.on('close', () => {
        log('WebSocket接続が閉じられました', 'info');
        setIsConnected(false);
        setClient(null);
      });

      setClient(newClient);
      setIsConnected(true);
      log('WebSocket接続成功', 'info');
    } catch (error) {
      log(`接続エラー: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (client) {
      client.close();
      log('切断リクエスト送信', 'info');
    }
  };

  const subscribe = () => {
    if (!client || !isConnected) {
      log('WebSocketが接続されていません', 'error');
      return;
    }
    if (!robotSerial) {
      log('ロボットシリアル番号を入力してください', 'error');
      return;
    }

    const topicList = topics.split(',').map(t => t.trim());
    (client as UserClient).subscribe(topicList, robotSerial);
    log(`購読リクエスト送信: topics=${topicList.join(',')}, serial=${robotSerial}`, 'sent');
  };

  const unsubscribe = () => {
    if (!client || !isConnected) {
      log('WebSocketが接続されていません', 'error');
      return;
    }
    if (!robotSerial) {
      log('ロボットシリアル番号を入力してください', 'error');
      return;
    }

    const topicList = topics.split(',').map(t => t.trim());
    (client as UserClient).unsubscribe(topicList, robotSerial);
    log(`購読解除リクエスト送信: topics=${topicList.join(',')}, serial=${robotSerial}`, 'sent');
  };

  const republish = () => {
    if (!client || !isConnected) {
      log('WebSocketが接続されていません', 'error');
      return;
    }
    if (!robotSerial) {
      log('ロボットシリアル番号を入力してください', 'error');
      return;
    }

    const topicList = topics.split(',').map(t => t.trim());
    const topic = topicList[0];
    (client as UserClient).republish(topic, robotSerial);
    log(`再公開リクエスト送信: topic=${topic}, serial=${robotSerial}`, 'sent');
  };

  const executeCommand = () => {
    if (!client || !isConnected) {
      log('WebSocketが接続されていません', 'error');
      return;
    }
    if (!robotSerial) {
      log('ロボットシリアル番号を入力してください', 'error');
      return;
    }
    if (!commandJson) {
      log('コマンドJSONを入力してください', 'error');
      return;
    }

    try {
      const command = JSON.parse(commandJson);
      (client as UserClient).executeActionCommand(robotSerial, command);
      log(`コマンド実行リクエスト送信: serial=${robotSerial}, command=${JSON.stringify(command)}`, 'sent');
    } catch (e) {
      log(`JSONパースエラー: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const publish = () => {
    if (!client || !isConnected) {
      log('WebSocketが接続されていません', 'error');
      return;
    }
    if (!publishTopic || !publishSerial) {
      log('トピックとロボットシリアル番号を入力してください', 'error');
      return;
    }
    if (!publishData) {
      log('データJSONを入力してください', 'error');
      return;
    }

    try {
      const data = JSON.parse(publishData);
      (client as RobotClient).publish(publishTopic, publishSerial, data);
      log(`データ公開リクエスト送信: topic=${publishTopic}, serial=${publishSerial}, data=${JSON.stringify(data)}`, 'sent');
    } catch (e) {
      log(`JSONパースエラー: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const statusColor = isConnecting ? 'bg-yellow-500' : (isConnected ? 'bg-green-500' : 'bg-red-500');
  const StatusIcon = isConnecting ? Loader2 : (isConnected ? CheckCircle2 : XCircle);
  const statusText = isConnecting ? '接続中...' : (isConnected ? '接続済み' : '未接続');

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">WebSocket接続テスト</h1>
        <p className="text-slate-600">WebSocket接続のテストとデバッグツール</p>
      </div>

      {/* Connection Settings */}
      <Card className="mb-6">
        <CardHeader className="bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle>接続設定</CardTitle>
            <Wifi className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="mb-4">
            <AlertDescription>
              <strong>Note:</strong> このページは @repo/websocket-client を使用したWebSocket接続のテストページです。
              {env !== 'PROD' && (
                <Badge className={`ml-2 ${getEnvColor(env)} text-white`}>{env} env</Badge>
              )}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="ws-url">WebSocket URL</Label>
              <Input
                id="ws-url"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                disabled={isConnected}
                placeholder="ws://localhost:3001/stream/stream"
                className="mt-1"
              />
              <p className="text-sm text-slate-500 mt-1">
                現在の環境 ({env}): {getWebSocketEndpoint(env)}
              </p>
            </div>

            <div>
              <Label htmlFor="realm">Realm</Label>
              <Select value={realm} onValueChange={(v) => setRealm(v as Realm)} disabled={isConnected}>
                <SelectTrigger id="realm" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">オペレーター (operator)</SelectItem>
                  <SelectItem value="robot">ロボット (robot)</SelectItem>
                  <SelectItem value="service">サービス (service)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-3">
              <Label htmlFor="token">認証トークン</Label>
              <div className="relative mt-1">
                <Input
                  id="token"
                  type={showToken ? 'text' : 'password'}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={isConnected}
                  placeholder="認証トークンを入力してください"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                オペレーター: SSOトークン / サービス: Access Key / ロボット: ロボット認証トークン
              </p>
            </div>

            <div className="flex items-end">
              <Badge className={`${statusColor} text-white px-4 py-2`}>
                <StatusIcon className={`h-4 w-4 mr-2 inline ${isConnecting ? 'animate-spin' : ''}`} />
                {statusText}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={connect}
              disabled={isConnected || !wsUrl || !token || isConnecting}
            >
              <Wifi className="h-4 w-4 mr-2" />
              接続
            </Button>
            <Button
              variant="destructive"
              onClick={disconnect}
              disabled={!isConnected}
            >
              <WifiOff className="h-4 w-4 mr-2" />
              切断
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Operator Operations */}
      {isConnected && (realm === 'operator' || realm === 'service') && (
        <Card className="mb-6">
          <CardHeader className="bg-green-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle>オペレーター操作</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="robot-serial">ロボットシリアル番号</Label>
                <Input
                  id="robot-serial"
                  value={robotSerial}
                  onChange={(e) => setRobotSerial(e.target.value)}
                  placeholder="UG00-0000-0000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="topics">トピック (カンマ区切りで複数指定可)</Label>
                <Input
                  id="topics"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  placeholder="status,location"
                  className="mt-1"
                />
                <p className="text-sm text-slate-500 mt-1">例: status,location,battery</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Button onClick={subscribe}>
                購読 (Subscribe)
              </Button>
              <Button variant="outline" onClick={unsubscribe}>
                購読解除 (Unsubscribe)
              </Button>
              <Button variant="secondary" onClick={republish}>
                再公開 (Republish)
              </Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="mb-4">
                <Label htmlFor="command-json">コマンド (JSON)</Label>
                <Textarea
                  id="command-json"
                  value={commandJson}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommandJson(e.target.value)}
                  placeholder='{"type": "move", "direction": "forward"}'
                  rows={4}
                  className="mt-1 font-mono"
                />
                <p className="text-sm text-slate-500 mt-1">実行するコマンドをJSON形式で入力してください</p>
              </div>
              <Button onClick={executeCommand}>
                コマンド実行
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Robot Operations */}
      {isConnected && realm === 'robot' && (
        <Card className="mb-6">
          <CardHeader className="bg-blue-500 text-white">
            <div className="flex items-center justify-between">
              <CardTitle>ロボット操作</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="publish-topic">トピック</Label>
                <Input
                  id="publish-topic"
                  value={publishTopic}
                  onChange={(e) => setPublishTopic(e.target.value)}
                  placeholder="status"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="publish-serial">ロボットシリアル番号</Label>
                <Input
                  id="publish-serial"
                  value={publishSerial}
                  onChange={(e) => setPublishSerial(e.target.value)}
                  placeholder="UG00-0000-0000"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="publish-data">データ (JSON)</Label>
              <Textarea
                id="publish-data"
                value={publishData}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPublishData(e.target.value)}
                placeholder='{"battery": 80, "status": "active"}'
                rows={6}
                className="mt-1 font-mono"
              />
              <p className="text-sm text-slate-500 mt-1">公開するデータをJSON形式で入力してください</p>
            </div>

            <Button onClick={publish}>
              公開 (Publish)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Message Log */}
      <Card>
        <CardHeader className="bg-slate-800 text-white">
          <div className="flex items-center justify-between">
            <CardTitle>メッセージログ</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLog}
              className="text-white hover:text-white hover:bg-slate-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={messageLogRef}
            className="bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm h-[400px] overflow-y-auto"
          >
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="text-[#858585] mr-2">{msg.timestamp}</span>
                <span className={
                  msg.type === 'sent' ? 'text-[#4ec9b0]' :
                  msg.type === 'received' ? 'text-[#ce9178]' :
                  msg.type === 'error' ? 'text-[#f44336]' :
                  'text-[#569cd6]'
                }>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
