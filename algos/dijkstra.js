import { neighbors, keyOf, reconstruct, animate, PriorityQueue } from '../utils/utils.js';

export async function runDijkstra(graph, start, end) {
  const dist = new Map();
  const parent = new Map();
  const visitedNodes = [];
  const closed = new Set();

  dist.set(keyOf(start), 0);

  const pq = new PriorityQueue(nodeId => dist.get(keyOf(nodeId)) || Infinity);
  pq.push(start);

  while (!pq.isEmpty()) {
    const nodeId = pq.pop();
    const key = keyOf(nodeId);

    if (closed.has(key)) continue;
    closed.add(key);
    visitedNodes.push(nodeId);

    if (nodeId === end) break;

    for (const neighbor of neighbors(graph, nodeId)) {
      const nbKey = keyOf(neighbor.id);
      if (closed.has(nbKey)) continue;

      const nd = (dist.get(key) || 0) + neighbor.distance;
      if (nd < (dist.get(nbKey) || Infinity)) {
        dist.set(nbKey, nd);
        parent.set(nbKey, nodeId);
        pq.push(neighbor.id);
      }
    }
  }

  const path = reconstruct(parent, start, end);
  return await animate(visitedNodes, path, 'dijkstra', start, end);
}
