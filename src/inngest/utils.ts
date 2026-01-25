import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  if (connections.length === 0) {
    return nodes;
  }
  // Create edges array for toposort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  // Add nodes witn no connections as self edges to ensure they are included
  const connectionNodeIds = new Set<string>();
  for (const conn of connections) {
    connectionNodeIds.add(conn.fromNodeId);
    connectionNodeIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectionNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  //   Perform topological sort
  let sortedNodeIds = toposort(edges);
  try {
    sortedNodeIds = toposort(edges);
    // Remove duplicates (from self-edges)
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains cycle");
    }
    throw error;
  }

  //   Map sorted IDs back to node objects
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
