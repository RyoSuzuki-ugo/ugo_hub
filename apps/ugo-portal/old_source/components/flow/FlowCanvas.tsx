"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

let nodeIdCounter = 3;

function InnerFlowCanvas() {
  const initialNodes: Node[] = [
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { title: "開始", tag: "開始ノード", description: "フローの起点" },
      type: "custom",
    },
    {
      id: "2",
      position: { x: 300, y: 100 },
      data: {
        title: "テストコマンド",
        tag: "移動",
        description: "A地点へ移動",
      },
      type: "custom",
    },
  ];

  const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // フォーム入力状態
  const [formData, setFormData] = useState({
    title: "",
    tag: "",
    description: "",
  });

  const addNode = useCallback(() => {
    const id = `${nodeIdCounter++}`;
    const newNode: Node = {
      id,
      type: "custom",
      position: { x: 200 + Math.random() * 200, y: 150 + Math.random() * 100 },
      data: {
        title: `ノード ${id}`,
        tag: "新規",
        description: "新しく追加されたノードです",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setFormData({
      title: node.data.title || "",
      tag: node.data.tag || "",
      description: node.data.description || "",
    });
  }, []);

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateNodeData = () => {
    if (!selectedNode) return;
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                ...formData,
              },
            }
          : node
      )
    );
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* メイン */}
      <div className="flex-1 h-full relative bg-white dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          onNodeClick={onNodeClick}
          fitView
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          }}
        >
          <MiniMap
            nodeColor={() => "#93c5fd"}
            nodeStrokeColor="#3b82f6"
            nodeBorderRadius={4}
          />
          <Controls />
          <Background variant="dots" gap={12} size={1} color="#d1d5db" />
        </ReactFlow>

        {/* ノード追加ボタン（左下） */}
        <button
          type="button"
          onClick={addNode}
          className="absolute bottom-4 left-12 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded shadow"
        >
          ➕ ノード追加
        </button>
      </div>

      {/* コンテキストパネル */}
      {selectedNode && (
        <aside className="w-80 h-full border-l border-gray-200 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">ノード編集</h2>
            <button type="button" onClick={() => setSelectedNode(null)}>
              ✕
            </button>
          </div>

          <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
            <div>
              <label className="block font-medium mb-1">タイトル</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">タグ</label>
              <input
                name="tag"
                value={formData.tag}
                onChange={handleFormChange}
                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">説明</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={updateNodeData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
            >
              ノードを更新
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-full">
        <InnerFlowCanvas />
      </div>
    </ReactFlowProvider>
  );
}
