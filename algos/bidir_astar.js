import { neighbors, keyOf, haversine, PriorityQueue, animate } from '../utils/utils.js';

export async function runBiDirAStar(graph, start, end, nodeMap) {
  const g1 = new Map(), g2 = new Map();
  const parent1 = new Map(), parent2 = new Map();
  const closed1 = new Set(), closed2 = new Set();
  const visitedNodes = [];

  g1.set(keyOf(start), 0);
  g2.set(keyOf(end), 0);

  const heuristic1 = (nodeId) => {
    if (!nodeMap) return 0;
    const n = nodeMap.get(nodeId);
    const e = nodeMap.get(end);
    if (!n || !e) return 0;
    return haversine(n, e);
  };

  const heuristic2 = (nodeId) => {
    if (!nodeMap) return 0;
    const n = nodeMap.get(nodeId);
    const s = nodeMap.get(start);
    if (!n || !s) return 0;
    return haversine(n, s);
  };

  const open1 = new PriorityQueue(nodeId => (g1.get(keyOf(nodeId)) || 0) + heuristic1(nodeId));
  const open2 = new PriorityQueue(nodeId => (g2.get(keyOf(nodeId)) || 0) + heuristic2(nodeId));
  open1.push(start);
  open2.push(end);

  let meet = null;
  let bestCost = Infinity;

  outer: while (!open1.isEmpty() || !open2.isEmpty()) {

    // ---- Forward step ----
    if (!open1.isEmpty()) {
      const nodeId = open1.pop();
      const key = keyOf(nodeId);
      if (closed1.has(key)) continue;
      closed1.add(key);
      visitedNodes.push(nodeId);

      if (nodeId === end) { meet = nodeId; break outer; }

      if (closed2.has(key)) {
        const cost = (g1.get(key) || 0) + (g2.get(key) || 0);
        if (cost < bestCost) { bestCost = cost; meet = nodeId; }
        break outer;
      }

      for (const neighbor of neighbors(graph, nodeId)) {
        const nbKey = keyOf(neighbor.id);
        if (closed1.has(nbKey)) continue;
        const tentative = (g1.get(key) || 0) + neighbor.distance;
        if (tentative < (g1.get(nbKey) || Infinity)) {
          g1.set(nbKey, tentative);
          parent1.set(nbKey, nodeId);
          open1.push(neighbor.id);
        }
      }
    }

    // ---- Backward step ----
    if (!open2.isEmpty()) {
      const nodeId = open2.pop();
      const key = keyOf(nodeId);
      if (closed2.has(key)) continue;
      closed2.add(key);
      visitedNodes.push(nodeId);

      if (nodeId === start) { meet = nodeId; break outer; }

      if (closed1.has(key)) {
        const cost = (g1.get(key) || 0) + (g2.get(key) || 0);
        if (cost < bestCost) { bestCost = cost; meet = nodeId; }
        break outer;
      }

      for (const neighbor of neighbors(graph, nodeId)) {
        const nbKey = keyOf(neighbor.id);
        if (closed2.has(nbKey)) continue;
        const tentative = (g2.get(key) || 0) + neighbor.distance;
        if (tentative < (g2.get(nbKey) || Infinity)) {
          g2.set(nbKey, tentative);
          parent2.set(nbKey, nodeId);
          open2.push(neighbor.id);
        }
      }
    }
  }

  // Reconstruct path through meeting point
  const path = [];
  if (meet) {
    const fwd = [];
    let cur = meet;
    while (cur && cur !== start) {
      fwd.push(cur);
      cur = parent1.get(keyOf(cur));
    }
    path.push(...fwd.reverse());

    if (meet !== end) {
      cur = parent2.get(keyOf(meet));
      while (cur && cur !== end) {
        path.push(cur);
        cur = parent2.get(keyOf(cur));
      }
      if (cur === end) path.push(end);
    }
  }

  await animate(visitedNodes, path, 'bidir-astar', start, end);
  return { visited: visitedNodes, path };
}
