import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointer}
      name="When click, Execute workflow"
      //   status={nodeStatus}
      // onSettings={}
      //   onDoubleClick={}
    />
  );
});
