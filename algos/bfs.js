import { neighbors, keyOf, reconstruct, animate } from "../utils/utils.js";

export async function runBFS(graph, start, end) {
  if (!start && start !== 0 || !end && end !== 0) return;

  const queue = [start];
  const visited = new Set([keyOf(start)]);
  const parent = new Map();
  const visitedNodes = [];

  while (queue.length) {
    const nodeId = queue.shift();
    visitedNodes.push(nodeId);
    if (nodeId === end) break;

    for (const neighbor of neighbors(graph, nodeId)) {
      const key = keyOf(neighbor.id);
      if (!visited.has(key)) {
        visited.add(key);
        parent.set(key, nodeId);
        queue.push(neighbor.id);
      }
    }
  }

  const path = reconstruct(parent, start, end);
  return await animate(visitedNodes, path, "bfs", start, end);
}
