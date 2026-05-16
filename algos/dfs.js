import { neighbors, keyOf, reconstruct, animate } from "../utils/utils.js";

export async function runDFS(graph, start, end) {
  if (!start && start !== 0 || !end && end !== 0) return;

  const stack = [start];
  const visited = new Set();
  const parent = new Map();
  const visitedNodes = [];

  while (stack.length) {
    const nodeId = stack.pop();
    const key = keyOf(nodeId);

    if (visited.has(key)) continue;
    visited.add(key);
    visitedNodes.push(nodeId);

    if (nodeId === end) break;

    for (const neighbor of neighbors(graph, nodeId)) {
      const nbKey = keyOf(neighbor.id);
      if (visited.has(nbKey)) continue;
      if (!parent.has(nbKey)) parent.set(nbKey, nodeId);
      stack.push(neighbor.id);
    }
  }

  const path = reconstruct(parent, start, end);
  return await animate(visitedNodes, path, "dfs", start, end);
}
