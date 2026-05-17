import { neighbors, keyOf, animate, haversine, euclidean, PriorityQueue } from '../utils/utils.js';

export async function runJPS(graph, start, end, nodeMap) {
  // For street networks, JPS reduces to A* since the graph structure
  // doesn't have the grid regularity needed for jump point optimization.
  // We implement it as A* for now.
  
  const g = new Map();
  const parent = new Map();
  const visitedNodes = [];
  const closed = new Set();

  g.set(keyOf(start), 0);

  const heuristic = (nodeId) => {
    if (!nodeMap) return 0;
    const n = nodeMap.get(nodeId);
    const e = nodeMap.get(end);
    if (!n || !e) return 0;
    return n.x !== undefined ? euclidean(n, e) : haversine(n, e);
  };

  const open = new PriorityQueue(nodeId => (g.get(keyOf(nodeId)) || 0) + heuristic(nodeId));
  open.push(start);

  while (!open.isEmpty()) {
    const nodeId = open.pop();
    const key = keyOf(nodeId);
    if (closed.has(key)) continue;
    closed.add(key);
    visitedNodes.push(nodeId);
    if (nodeId === end) break;

    for (const neighbor of neighbors(graph, nodeId)) {
      const nbKey = keyOf(neighbor.id);
      if (closed.has(nbKey)) continue;
      const ng = (g.get(key) || 0) + neighbor.distance;
      if (ng < (g.get(nbKey) || Infinity)) {
        g.set(nbKey, ng);
        parent.set(nbKey, nodeId);
        open.push(neighbor.id);
      }
    }
  }

  // Reconstruct path
  const path = [];
  let cur = end;
  while (cur && cur !== start) {
    path.push(cur);
    cur = parent.get(keyOf(cur));
  }
  if (cur !== start) path.length = 0; else path.reverse();

  await animate(visitedNodes, path, 'jps', start, end);
  return { visited: visitedNodes, path };
}
