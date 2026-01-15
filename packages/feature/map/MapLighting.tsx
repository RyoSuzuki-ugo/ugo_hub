/**
 * マップ用の照明設定
 * 環境光とディレクショナルライトで均一な明るさを提供
 */
export function MapLighting() {
  return (
    <>
      {/* 環境光: シーン全体を均一に照らす */}
      <ambientLight intensity={0.8} />

      {/* ディレクショナルライト: 上から照らして影をつける */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow={false}
      />
    </>
  );
}
