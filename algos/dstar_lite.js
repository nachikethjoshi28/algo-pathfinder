import { neighbors, keyOf, reconstruct, animate, haversine, PriorityQueue } from '../utils/utils.js';

export async function runDStarLite(graph, start, end, nodeMap) {
  const g = new Map(), rhs = new Map(), parent = new Map(), visitedNodes = [];
  
  rhs.set(keyOf(start), 0);
  
  const heuristic = (nodeId) => {
    if (!nodeMap) return 0;
    const n = nodeMap.get(nodeId);
    const e = nodeMap.get(end);
    if (!n || !e) return 0;
    return haversine(n, e);
  };

  const open = new PriorityQueue(nodeId => Math.min(g.get(keyOf(nodeId)) || Infinity, rhs.get(keyOf(nodeId)) || Infinity) + heuristic(nodeId));
  open.push(start);

  while (!open.isEmpty()) {
    const nodeId = open.pop();
    visitedNodes.push(nodeId);
    if (nodeId === end) break;

    for (const neighbor of neighbors(graph, nodeId)) {
      const tentative = (rhs.get(keyOf(nodeId)) || 0) + neighbor.distance;
      if (tentative < (rhs.get(keyOf(neighbor.id)) || Infinity)) {
        rhs.set(keyOf(neighbor.id), tentative);
        parent.set(keyOf(neighbor.id), nodeId);
        if (!open.includes(neighbor.id)) open.push(neighbor.id);
      }
    }
  }

  const path = reconstruct(parent, start, end);
  await animate(visitedNodes, path, 'dstar', start, end);
  return { visited: visitedNodes, path };
}
