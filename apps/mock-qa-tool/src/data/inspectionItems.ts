// Auto-generated from data.xlsx
export interface InspectionItem {
  id: string;
  category: string;
  item: string;
  procedure: string;
  attentionPoint: string;
  criteria: string;
}

export const inspectionItems: InspectionItem[] = [
  {
    "id": "item-1",
    "category": "ジンバルカメラ\n組立後耐久",
    "item": "ジンバルカメラ\n組立後耐久",
    "procedure": "ポータルへアクセスして、『ジンバルカメラ耐久』を実行",
    "attentionPoint": "新規作成時、\nジンバルカメラ交換リワーク後の未実施",
    "criteria": "耐久動作中及び動作後に『ジンバルカメラエラー』が出ないこと"
  },
  {
    "id": "item-2",
    "category": "起動・終了・充電",
    "item": "主電源スイッチ\n・Rev001,002は\n　非搭載のため対象外",
    "procedure": "①トランクケースの左側、主電源スイッチのラベルと向きを確認\n",
    "attentionPoint": "",
    "criteria": "・右写真のように\n　ラベルが貼られている事\n・スイッチの向きが正しいこと\n  左側：〇 (OFF)　 右側：I (ON)"
  },
  {
    "id": "item-3",
    "category": "起動・終了・充電",
    "item": "電源ON",
    "procedure": "①主電源スイッチをON側に切り替える(Rev001,002は対象外)\n②ugo mini の電源ボタンを押す\n③ugo miniの電源ボタンLEDが点滅⇒点灯\n　",
    "attentionPoint": "",
    "criteria": "・miniの顔ディスプレイ(LCD)が表示されること\n　・miniのペリスコープが、\n　　ホームポジションへの移動動作をすること\n　・ugo Portalで、接続状況が「ONLINE」となること\n　・サービス状態がすべてOK表示なこと"
  },
  {
    "id": "item-4",
    "category": "起動・終了・充電",
    "item": "電源OFF",
    "procedure": "①ugo miniの電源ボタンを長押し\n②電子音が聞こえたら、ボタンを戻す。",
    "attentionPoint": "",
    "criteria": "　・miniの顔ディスプレイ(LCD)が\n　　「shutdown」表示されること\n　・電源OFF時の効果音が鳴ること\n　・上記動作実施後、電源が切れること"
  },
  {
    "id": "item-5",
    "category": "起動・終了・充電",
    "item": "充電BOX\n充電ステーション充電確認\n【手動接続】",
    "procedure": "①充電器をコンセントとステーションに接続\n②充電器をONにする\n③起動させた状態のminiを充電ステーションに押し入れて接続する\n",
    "attentionPoint": "Rev4機体の場合、直挿しでも確認",
    "criteria": "充電器、ステーションのインジケーターが緑→赤になること"
  },
  {
    "id": "item-6",
    "category": "起動・終了・充電",
    "item": "充電ステーション\n【コマンド実行による】",
    "procedure": "①ポータルコマンドリスト設定を開き\r\n　『自動充電開始mini』コマンドパラメーターを確認、⇒に記入\n②電源ON状態にする(ugo 電源ボタンの周囲が点灯)\n　ペリスコープを600mmに設定する\n③ステーション正面８０cmに正対して配置、\n　「自動充電開始mini」コマンドを実行する　\n④５回実施",
    "attentionPoint": "",
    "criteria": "コマンド\nパラメーター"
  },
  {
    "id": "item-7",
    "category": "起動・終了・充電",
    "item": "充電ステーション\n【Flow実行による】",
    "procedure": "①電源ON状態にする(ugo 電源ボタンの周囲が点灯)\n②所定の位置にugoを配置し、Flow「自動充電開始」を実行する",
    "attentionPoint": "",
    "criteria": "充電帰還動作中に効果音が鳴ること"
  },
  {
    "id": "item-8",
    "category": "起動・終了・充電",
    "item": "バッテリー残量表示",
    "procedure": "①ugo Portal画面に接続し、充電マークを選択する\n",
    "attentionPoint": "",
    "criteria": "・バッテリーアイコンが空表示になっていないこと\n・『アクティブ』、『充電中』、『充電完了』のいずれかにステータスがなっていること"
  },
  {
    "id": "item-9",
    "category": "非常停止",
    "item": "非常停止ボタンの動作確認",
    "procedure": "①非常停止ボタンを押下する\n（ugoが動作中であれば、実行していた動作が中断される）",
    "attentionPoint": "",
    "criteria": "非常停止動作すること\n(顔ディスプレイが「非常停止」表示となる)\n(Portal画面に「非常停止ボタンが押されています」と表示される)\n⇒駆動系が遮断されること(カート、ペリスコープ)\n　※ペリスコープはその場で静止する\n⇒CPUは遮断されないこと\n   (VIM / Jetson Nano等、内部シングルコンピューター)"
  },
  {
    "id": "item-10",
    "category": "非常停止",
    "item": "非常停止ボタン復帰時の動作確認",
    "procedure": "①非常停止ボタンを復帰する",
    "attentionPoint": "",
    "criteria": "①顔ディスプレイが「非常停止」から「デフォルト」表示へ戻ること"
  },
  {
    "id": "item-11",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【前進】",
    "procedure": "①ugo miniに接続し、「↑」キーを押す",
    "attentionPoint": "",
    "criteria": "前進すること"
  },
  {
    "id": "item-12",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【後進】",
    "procedure": "①ugo miniに接続し、「↓」キーを押す",
    "attentionPoint": "",
    "criteria": "後進すること"
  },
  {
    "id": "item-13",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【右移動】",
    "procedure": "①ugo miniに接続し、「Shift」＋「→」キーを押す",
    "attentionPoint": "",
    "criteria": "反応しないこと"
  },
  {
    "id": "item-14",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【左移動】",
    "procedure": "①ugo miniに接続し、「Shift」＋「←」キーを押す",
    "attentionPoint": "",
    "criteria": "反応しないこと"
  },
  {
    "id": "item-15",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【右旋回】",
    "procedure": "①ugo miniに接続し、「→」キーを押す",
    "attentionPoint": "",
    "criteria": "右回りに旋回すること"
  },
  {
    "id": "item-16",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【左旋回】",
    "procedure": "①ugo miniに接続し、「←」キーを押す",
    "attentionPoint": "",
    "criteria": "左回りに旋回すること"
  },
  {
    "id": "item-17",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【前進】※代替キー",
    "procedure": "①ugo miniに接続し、「W」キーを押す",
    "attentionPoint": "",
    "criteria": "前進すること"
  },
  {
    "id": "item-18",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【後進】※代替キー",
    "procedure": "①ugo miniに接続し、「S」キーを押す",
    "attentionPoint": "",
    "criteria": "後進すること"
  },
  {
    "id": "item-19",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【右移動】※代替キー",
    "procedure": "①ugo miniに接続し、「D」キーを押す",
    "attentionPoint": "",
    "criteria": "右回りに旋回すること"
  },
  {
    "id": "item-20",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【左移動】※代替キー",
    "procedure": "①ugo miniに接続し、「A」キーを押す",
    "attentionPoint": "",
    "criteria": "左回りに旋回すること"
  },
  {
    "id": "item-21",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【右旋回】※代替キー",
    "procedure": "①ugo miniに接続し、「4」キーを押す",
    "attentionPoint": "",
    "criteria": "反応しないこと"
  },
  {
    "id": "item-22",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "全方向移動【左旋回】※代替キー",
    "procedure": "①ugo miniに接続し、「1」キーを押す",
    "attentionPoint": "",
    "criteria": "反応しないこと"
  },
  {
    "id": "item-23",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "動作停止",
    "procedure": "①ugo miniに接続し、「←」キーを長押し\n②旋回動作中にSpaceキーを押す",
    "attentionPoint": "",
    "criteria": "旋回動作がすぐに停止すること"
  },
  {
    "id": "item-24",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "リングライト：ON/OFF",
    "procedure": "①ugo miniに接続し、操作画面のリングライトボタンをON/OFFする",
    "attentionPoint": "",
    "criteria": "リングライトが点灯/消灯と切り替わり、\nアイコンの表示が点灯/消灯中になること"
  },
  {
    "id": "item-25",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "パトランプ：ON/OFF",
    "procedure": "①ugo miniに接続し、操作画面のパトランプボタンをON/OFFする",
    "attentionPoint": "",
    "criteria": "パトランプが点灯/消灯と切り替わり、\nアイコンの表示が点灯/消灯中になること"
  },
  {
    "id": "item-26",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "テレスコープ高さ変更",
    "procedure": "①ugo miniに接続し、80cm/120cm/170cmのコマンドを各実行し\n　高さを測定",
    "attentionPoint": "",
    "criteria": "スライドバーを可変させて、\n指定の高さに指示\n床から天板の実測の高さをメジャーで測定\n\n〇判定基準\n指定高さに＋10cmを足した値が\n天板の高さ\n±10mm以内になること"
  },
  {
    "id": "item-27",
    "category": "遠隔操作\n（キーボード・アイコン)",
    "item": "テレスコープの\nホームポジション設定",
    "procedure": "①ポータル上で、コマンド『ペリスコープデフォルト高さ変更[580mm]』を実行\n②miniをシャットダウンし、再起動させる\n③ペリスコープが初期位置への遷移動作後に確認",
    "attentionPoint": "",
    "criteria": "再起動後、\n床から天板の実測の高さをメジャーで測定\n合格範囲　　Rev001,002：674mm ±10mm\n　　　　　　Rev003,004：680mm ±10mm\n　　　　　　Rev005       ：680mm ±10mm"
  },
  {
    "id": "item-28",
    "category": "カメラ",
    "item": "ジンバルカメラ４K撮影\n画像品質検査\nmini_完成検査作業標準(G1 Rev005)",
    "procedure": "【４K撮影画像の保存及び、撮影品質（距離100cm）】",
    "attentionPoint": "",
    "criteria": "・カメラ撮影画像がレポートとして\n　４K(3840×2160)出力できること\n・４K撮影画像に大きなゆがみ、ボケが無いこと\n・カメラに傾きが無いこと"
  },
  {
    "id": "item-29",
    "category": "カメラ",
    "item": "ジンバルカメラ\n向き変更動作",
    "procedure": "①ugo miniに接続し、操作画面左下にあるジョグダイアルを操作する",
    "attentionPoint": "",
    "criteria": "ジョグダイアルを上下左右させてカメラの向きが変わること"
  },
  {
    "id": "item-30",
    "category": "カメラ",
    "item": "サーマルカメラの映像確認",
    "procedure": "①サーマルカメラオプションをTopケースに取り付け\n②トップケースのUSBポート２(左)にサーマルUSBを接続\n③miniを再起動させる\n④カメラ切り替えを『ON』にし\n    ポータル画面のカメラアイコンをクリック、サーマルカメラを選択\n③右下設定ボタンをクリックし、フォト撮影を選択\n④ugoポータルを開き、レポート管理からフォト撮影結果を開く\n　撮影画像をダウンロードする\n⑤取得できた画像を、スクリーンショットで保存し右に添付\n　挿入➡画像➡セル内に画像を添付\n⑥『検査画像』フォルダに検査画像を保存した上で\n　右にリンクを貼り付け",
    "attentionPoint": "Rev4機体の場合\nコマンド『サーマルカメラ再起動』を実行後確認\n\nSSH接続で再起動が必要な場合は、技術Gr対応",
    "criteria": "・サーマルカメラ映像が表示されること\n・温度情報が表示されること"
  },
  {
    "id": "item-31",
    "category": "SSD動作確認",
    "item": "長時間録画機能の実施",
    "procedure": "①ロボットを検査エリア、長時間録画指定位置に移動させる\n②ポータルの操作画面を開き、\n　フロントカメラ映像が表示されてることを確認\n②ポータル画面の右下設定から『長時間録画開始』を選択\n　ポップアップが出るので、『はい』を選択\n③ポータル画面左下に、（長時間録画：準備中）表示が出たこと確認\n④１分ほど待ち、ポータル画面左下表示が（長時間録画：録画中...）へ\n　切り替わったら５分間、そのまま録画を行う\n⑤５分後、ポータル画面の右下設定から『長時間録画終了』を選択\n　ポップアップが出るので、『はい』を選択\n⑥（長時間録画：終了中...）表示が消えるまで待つ※最長５分ほど\n⑦ポータルメイン画面の録画データ管理から動画を取得\n　※アップロード画質【 高画質（720p）】を選択すること\n⑧動画をPC上で再生し、録画内容を確認。\n⑨『検査画像』フォルダに検査動画を保存した上で\n　右にリンクを貼り付け",
    "attentionPoint": "・評価版Rev004以前は対象外",
    "criteria": "・手順①～⑥の長時間録画が実施できること\n・録画動画をダウンロードでき、ダウンロードした動画を\n　PCにて再生、映像確認できること"
  },
  {
    "id": "item-32",
    "category": "Topboxオプション",
    "item": "Topboxオプション接続確認",
    "procedure": "ポート１(右)、２(左)それぞれ確認\n①miniをシャットダウンさせるＵＳＢポートカバーを外す\n②サーマルカメラUSBを右または左のポートに差し込み\n③miniを起動させる\n④サーマルカメラ映像を確認",
    "attentionPoint": "Rev4機体の場合\nサーマル使用可否にかかわらずルーターにてUSBの確認を行う",
    "criteria": "オプションポート1(ロボット進行方向右側)\n ➡サーマル映像が表示されれば合格判定"
  },
  {
    "id": "item-33",
    "category": "LiDARノイズ",
    "item": "LiDAR本体への傷の有無",
    "procedure": "①LiDAR本体に傷やゴミが付いていないか\"目視\"確認する",
    "attentionPoint": "汚れがある場合は、レンズクリーナーで清掃すること",
    "criteria": "LiDAR本体に大きな傷がないこと"
  },
  {
    "id": "item-34",
    "category": "LiDARノイズ",
    "item": "LiDARノイズの発生有無",
    "procedure": "①高さ80cm以上のコの字型の壁を用意し、\n　miniを正面の壁から40cmの位置に配置する\n②ugo Portal画面に接続する\n③接続するタブ内の、『マップエディタ　V1』を開く\n④右上『部分マップ』ボタンを押して表示を切り替え\n　マウスホイールで最大まで点群画像表示を拡大\n　※↓「部分マップ」映像のスクリーンショットを添付\n④取得できた画像を、スクリーンショットで保存し右に添付\n　挿入➡画像➡セル内に画像を添付\n　⑥『検査画像』フォルダに検査画像を保存した上で\n　右にリンクを貼り付け\n⑥各画像を右の判定基準に沿って確認",
    "attentionPoint": "",
    "criteria": "壁の形状がきちんと点群で表示されること。\n壁以外の点群が表示されないこと。"
  },
  {
    "id": "item-35",
    "category": "走行精度・旋回",
    "item": "走行距離精度【直進1m】",
    "procedure": "①コマンド「直進1m」を実行し、ugo miniが前進した距離を測定する\n　以下を確認する\n　・1m直進すること\n　（実測距離とオドメトリ表示距離に差異がないこと）",
    "attentionPoint": "",
    "criteria": ""
  },
  {
    "id": "item-36",
    "category": "走行精度・旋回",
    "item": "走行距離精度【直進3m】",
    "procedure": "①コマンド「直進3m」を実行し、ugo miniが前進した距離を測定する\n　以下を確認する ※左右方向に10cm以上ズレが出ないこと\n　・3m直進すること\n　（実測距離とオドメトリ表示距離に差異がないこと）",
    "attentionPoint": "",
    "criteria": ""
  },
  {
    "id": "item-37",
    "category": "走行精度・旋回",
    "item": "走行距離精度【直進5m】",
    "procedure": "①コマンド「直進5m」を実行し、ugoが前進した距離を測定する\n　以下を確認する\n　・5m直進すること\n　（実測距離とオドメトリ表示距離に差異がないこと）",
    "attentionPoint": "",
    "criteria": ""
  },
  {
    "id": "item-38",
    "category": "走行精度・旋回",
    "item": "旋回精度【右回転45°】",
    "procedure": "①ugo miniにコンパスを取り付ける\n②コマンド「右回転45°」を実行し、ugo miniが回転した角度を測定する\n　以下を確認する\n　・右回りに45°旋回すること　±３度以内",
    "attentionPoint": "",
    "criteria": "1回目　角度(°)"
  },
  {
    "id": "item-39",
    "category": "走行精度・旋回",
    "item": "旋回精度【左回転45°】",
    "procedure": "①ugo miniにコンパスを取り付ける\n②コマンド「左回転45°」を実行し、ugo miniが回転した角度を測定する\n　以下を確認する\n　・左回りに45°旋回すること　±３度以内",
    "attentionPoint": "",
    "criteria": "1回目　角度(°)"
  },
  {
    "id": "item-40",
    "category": "走行精度・旋回",
    "item": "旋回精度【右回転90°】",
    "procedure": "①ugo miniにコンパスを取り付ける\n②コマンド「右回転90°」を実行し、ugo miniが回転した角度を測定する\n　以下を確認する\n　・右回りに90°旋回すること　±３度以内",
    "attentionPoint": "",
    "criteria": "1回目　角度(°)"
  },
  {
    "id": "item-41",
    "category": "走行精度・旋回",
    "item": "旋回精度【左回転90°】",
    "procedure": "①ugo miniにコンパスを取り付ける\n②コマンド「左回転90°」を実行し、ugo miniが回転した角度を測定する\n　以下を確認する\n　・左回りに90°旋回すること　±３度以内",
    "attentionPoint": "",
    "criteria": "1回目　角度(°)"
  },
  {
    "id": "item-42",
    "category": "走行精度・旋回",
    "item": "旋回精度【右回転180°】",
    "procedure": "①ugo miniにコンパスを取り付ける\n②コマンド「右回転180°」を実行し、ugo miniが回転した角度を測定する\n　以下を確認する\n　・右回りに180°旋回すること　±5度以内",
    "attentionPoint": "",
    "criteria": "1回目　角度(°)"
  },
  {
    "id": "item-43",
    "category": "走行精度・旋回",
    "item": "旋回精度【左回転180°】",
    "procedure": "①ugo miniにコンパスを取り付ける\n②コマンド「左回転180°」を実行し、ugo miniが回転した角度を測定する\n　以下を確認する\n　・左回りに180°旋回すること　±5度以内",
    "attentionPoint": "",
    "criteria": "1回目　角度(°)"
  },
  {
    "id": "item-44",
    "category": "インターファイス",
    "item": "顔ディスプレイ表示【警備中】",
    "procedure": "①ugo miniに接続し、「顔ディスプレイ：警備中」コマンドを押す",
    "attentionPoint": "",
    "criteria": "顔ディスプレイに「警備中」が表示される"
  },
  {
    "id": "item-45",
    "category": "インターファイス",
    "item": "顔ディスプレイ表示【デフォルト】",
    "procedure": "①ugo miniに接続し、「顔ディスプレイ：デフォルト」コマンドを押す",
    "attentionPoint": "",
    "criteria": "顔ディスプレイに「デフォルト(通常時の目)」が表示されること"
  },
  {
    "id": "item-46",
    "category": "インターファイス",
    "item": "音声ファイル再生",
    "procedure": "①ugo miniに接続し、「こんにちは」コマンドを押す",
    "attentionPoint": "",
    "criteria": "音声「こんにちは」が再生され、適切なボリュームであること"
  },
  {
    "id": "item-47",
    "category": "インターファイス",
    "item": "ugo mini本体のマイク動作確認",
    "procedure": "①ugo miniに接続する\n②ugo miniに向けて話しかける(PCのスピーカーON状態で)",
    "attentionPoint": "",
    "criteria": "ugo miniに話しかけた声が、PCのスピーカーから聞こえること"
  },
  {
    "id": "item-48",
    "category": "インターファイス",
    "item": "ugo mini本体のスピーカー動作確認\n【PCマイク】",
    "procedure": "①ブラウザ側のマイク使用許可を確認する\n②mキーを押しながら、PCマイクに向けて発話する\n③mキーを離す",
    "attentionPoint": "",
    "criteria": "マイクに向けた音声がugo miniから聞こえること"
  },
  {
    "id": "item-49",
    "category": "スピーカー・マイク",
    "item": "スピーカー出力音量",
    "procedure": "①ugo Portal画面に接続する\n②画面右下のボタンから「設定」画面を開く\n③[ugoサウンド]タブから「スピーカー出力音量」の数値を変更\n④任意の発話コマンドを実行",
    "attentionPoint": "",
    "criteria": "発話にスピーカー音量の変更が反映されていること"
  },
  {
    "id": "item-50",
    "category": "スピーカー・マイク",
    "item": "マイク入力ゲイン",
    "procedure": "①ugo Portal画面に接続する\n②画面右下のボタンから「設定」画面を開く\n③[ugoサウンド]タブから「マイク入力ゲイン」の数値を変更\n④ugoのマイクに音声を入力",
    "attentionPoint": "",
    "criteria": "音声にマイク入力ゲインの変更が反映されていること"
  },
  {
    "id": "item-51",
    "category": "スピーカー・マイク",
    "item": "マイクノイズ",
    "procedure": "①[ugoサウンド]タブから「マイク入力ゲイン」を上げる",
    "attentionPoint": "",
    "criteria": "マイクノイズが発生しないこと"
  },
  {
    "id": "item-52",
    "category": "スピーカー・マイク",
    "item": "ELVキャリブレーション(両手)",
    "procedure": "①「ugo_アームキャリブレーションマニュアル」の手順に従い\nエレベータボタン押しのキャリブレーションを行う\n※↓設定値一覧のスクショを添付",
    "attentionPoint": "",
    "criteria": "ELVキャリブ実施後、ボタン押しの精度が20mm以内であること\n※NGの場合は、ELVキャリブを再実施すること"
  },
  {
    "id": "item-53",
    "category": "超音波センサ",
    "item": "センサノイズの発生有無",
    "procedure": "①ugo DevToolsの「ログ」タブを開き、ugo.sensor.sonar.dataにチェックをつける\n②縦横30センチ程度の板を用意する",
    "attentionPoint": "mini G1 Rev005は\n超音波センサーなし\n検査対象外",
    "criteria": "miniに接続されている分の超音波センサの値\n\"SNR1(ロボット進行方向右側)\"、\n\"SNR2(ロボット進行方向左側)\"\nが表示され、超音波センサに板を近づけた時に\nこれらの値が変化すること。\n\nrev005はSNR1(ロボット下側のみ)"
  },
  {
    "id": "item-54",
    "category": "Mapエディタ",
    "item": "マップエディタ起動【現在フロア設定】",
    "procedure": "①「現在フロア設定」からMAPエディタを起動する\n②別のタブでMAPエディタが起動する",
    "attentionPoint": "",
    "criteria": "別タブでFloor Mapが起動すること\n(左下に操作用のアイコンが表示され、ONLINE(緑色)となる)"
  },
  {
    "id": "item-55",
    "category": "Mapエディタ",
    "item": "マップエディタ上のugo状態",
    "procedure": "①MAPエディタ起動\n②マウスのホイールをスクロールさせ、表示領域を拡大縮小させる\n③マウスの左ボタンをクリックし、表示領域を移動させる",
    "attentionPoint": "",
    "criteria": "ugo本体のアイコンとLiDARの状態が表示されていること"
  },
  {
    "id": "item-56",
    "category": "Mapエディタ",
    "item": "マップ作成開始",
    "procedure": "①Floor Map画面：Mapデータ右横の+をクリック\n②「MAP作成開始」をクリック\n③「保存」をクリックし5〜10秒ほど待つ or 画面をリロードする\n④Mapデータのリストボックスを選択する",
    "attentionPoint": "",
    "criteria": "ugo本体を中心に、LiDARから見えるエリアが灰色になり、\nugo本体を移動すると灰色のエリアが拡大すること"
  },
  {
    "id": "item-57",
    "category": "Mapエディタ",
    "item": "経路作成①\n「ugoを走行させて自動作成」",
    "procedure": "①Floor Map画面：経路右横の+をクリック\n②「走行経路の記録」をクリック\n③ugo miniを走行させ、走行経路を記録させる\n④経路の名称を入力し、「保存」をクリック",
    "attentionPoint": "",
    "criteria": "経路が保存されること"
  },
  {
    "id": "item-58",
    "category": "Mapエディタ",
    "item": "経路作成②\n「画面上で手動作成」",
    "procedure": "①Floor Map画面：経路右横の+をクリック\n②「走行経路の編集」をクリック\n③作成されたMap上に、任意のWayPointを登録する\n④経路の名称を入力し、「保存」をクリック",
    "attentionPoint": "",
    "criteria": "経路が保存されること"
  },
  {
    "id": "item-59",
    "category": "Mapエディタ",
    "item": "試走",
    "procedure": "①Mapエディタ起動\n②Mapデータ：経路作成①で作成した経路を選択\n③ugo miniを開始位置に配置し、画面左下「試走開始」をクリック\n④Mapデータ：経路作成②で選択した経路を選択\n⑤ugo miniを開始位置に配置し、画面左下「試走開始」をクリック",
    "attentionPoint": "",
    "criteria": "作成した経路通りにugo miniが走行すること"
  },
  {
    "id": "item-60",
    "category": "Mapエディタ",
    "item": "部分マップ作成",
    "procedure": "①Floor Map画面：右上「部分MAP」を選択\n②Partial Map画面：部分Mapデータ右横の+をクリック\n③キャプチャ範囲(黄色い枠)を指定する\n④Mapの名称を入力し、「部分MAP保存」をクリック",
    "attentionPoint": "",
    "criteria": "部分マップが保存されること"
  },
  {
    "id": "item-61",
    "category": "通信環境",
    "item": "WiFiルーター USB接続：SCR01SWU",
    "procedure": "\n①モバイルルーターを起動する\n②ugoにルーターを接続\n　【USBtype A-Cケーブルのみ使用】\n③ルーターの\n　ＵＳＢデザリング機能をＯＮにする\n④１、２分程度待つ",
    "attentionPoint": "",
    "criteria": "portal画面に本機体が表示され、接続できること\n(「online」状態になっていること)\n【ポータル左下の通信表示がusb０になっていること】\n\nルーターで接続できていない状態の通信表示は【wlan0】"
  },
  {
    "id": "item-62",
    "category": "通信環境",
    "item": "WiFiルーター LAN接続：SCR01SWU",
    "procedure": "miniをシャットダウンさせる\n①ルーターを起動する\n②ugoにルーターを接続する\n　【LANハブ、イーサケーブル\n　　ＵＳＢケーブルを使用】\n③ugoを起動する",
    "attentionPoint": "",
    "criteria": "portal画面に本機体が表示され、接続できること\n(「online」状態になっていること)\n【左下の通信表示がeth1になっていること】\n\nルーターで接続できていない状態の通信表示は【wlan0】"
  },
  {
    "id": "item-63",
    "category": "通信環境",
    "item": "PD給電",
    "procedure": "①ugoの充電が100%になっていることを確認する\n②PDとPC(ルーター等でも可)の端子をケーブルで接続する\n③ugoの電源をONにする\n④PCが充電中となることを確認し、開始時点の残量を記録する\n⑤この後、1時間放置する\n⑥1時間後、PCとugoのバッテリ残量を確認",
    "attentionPoint": "",
    "criteria": "PCのバッテリ残量が増え、ugoのバッテリ残量が\n減少していること"
  },
  {
    "id": "item-64",
    "category": "通信環境",
    "item": "起動中のルーター変更",
    "procedure": "①接続中のルーターを引き抜く\n②別のルーターを接続し、しばらく待つ",
    "attentionPoint": "",
    "criteria": "ugoが正常に起動し、ugo Portalで「online」になること"
  },
  {
    "id": "item-65",
    "category": "検査後のデータ消去",
    "item": "ジンバルカメラSDデータ消去",
    "procedure": "①コマンド『ジンバルSDフォーマット』を実行",
    "attentionPoint": "",
    "criteria": "実行エラー表示等が無いこと"
  },
  {
    "id": "item-66",
    "category": "バッテリー充電",
    "item": "バッテリーの100％充電",
    "procedure": "①充電器を接続し\n　満充電を行う（電源OFF　主電源スイッチON状態）",
    "attentionPoint": "",
    "criteria": "満充電判断基準：\nminiを電源OFF状態で\n充電器のインジケーターが『赤』⇒『緑』に切り替わる"
  },
  {
    "id": "item-67",
    "category": "出荷時の充電",
    "item": "出荷時の充電確認",
    "procedure": "①ugo Portal画面に接続し、ugoの「電池残量」を確認",
    "attentionPoint": "",
    "criteria": "電池残量表示が空でないこと"
  },
  {
    "id": "item-68",
    "category": "同梱品",
    "item": "同梱品チェック",
    "procedure": "①右記項目を確認",
    "attentionPoint": "",
    "criteria": "充電器の外観に傷や凹みはないこと"
  }
];

// カテゴリ一覧を抽出
export const categories = Array.from(
  new Set(inspectionItems.map((item) => item.category))
);
