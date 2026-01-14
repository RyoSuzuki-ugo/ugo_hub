import { Handle, Position } from "reactflow";

interface CustomNodeData {
  title: string;
  tag: string;
  description: string;
}

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-md rounded-md px-4 py-3 text-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-blue-600 mr-2">{data.title}</span>
        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
          {data.tag}
        </span>
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-xs">
        {data.description}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 bg-blue-500 "
      />
    </div>
  );
};

export default CustomNode;
