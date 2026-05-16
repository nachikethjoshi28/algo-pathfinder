import { neighbors, keyOf, reconstruct, animate, haversine, PriorityQueue } from '../utils/utils.js';

export async function runGreedy(graph, start, end, nodeMap) {
  const heuristic = (nodeId) => {
    if (!nodeMap) return 0;
    const n = nodeMap.get(nodeId);
    const e = nodeMap.get(end);
    if (!n || !e) return 0;
    return haversine(n, e);
  };

  const open = new PriorityQueue(nodeId => heuristic(nodeId));
  const parent = new Map();
  const seen = new Set([keyOf(start)]);
  const visitedNodes = [];

  open.push(start);

  while (!open.isEmpty()) {
    const nodeId = open.pop();
    visitedNodes.push(nodeId);
    if (nodeId === end) break;

    for (const neighbor of neighbors(graph, nodeId)) {
      const k = keyOf(neighbor.id);
      if (seen.has(k)) continue;
      seen.add(k);
      parent.set(k, nodeId);
      open.push(neighbor.id);
    }
  }
  const path = reconstruct(parent, start, end);
  await animate(visitedNodes, path, 'greedy', start, end);
  return { visited: visitedNodes, path };
}
