import { neighbors, keyOf, animate } from '../utils/utils.js';

export async function runBiDirBFS(graph, start, end) {
  const q1 = [start], q2 = [end];
  const p1 = new Map(), p2 = new Map();
  const v1 = new Set([keyOf(start)]), v2 = new Set([keyOf(end)]);
  const visitedNodes = [];

  let meet = null;

  while (q1.length && q2.length && !meet) {
    // expand from start side
    const n1 = q1.shift(); visitedNodes.push(n1);
    for (const neighbor of neighbors(graph, n1)) {
      const k = keyOf(neighbor.id);
      if (v1.has(k)) continue;
      v1.add(k); p1.set(k, n1); q1.push(neighbor.id);
      if (v2.has(k)) { meet = neighbor.id; break; }
    }
    if (meet) break;

    // expand from end side
    const n2 = q2.shift(); visitedNodes.push(n2);
    for (const neighbor of neighbors(graph, n2)) {
      const k = keyOf(neighbor.id);
      if (v2.has(k)) continue;
      v2.add(k); p2.set(k, n2); q2.push(neighbor.id);
      if (v1.has(k)) { meet = neighbor.id; break; }
    }
  }

  // reconstruct via meeting point
  const path = [];
  if (meet) {
    let cur = meet;
    while (cur && cur !== start) { path.push(cur); cur = p1.get(keyOf(cur)); }
    path.reverse();
    cur = p2.get(keyOf(meet));
    while (cur && cur !== end) { path.push(cur); cur = p2.get(keyOf(cur)); }
    if (cur === end) path.push(end);
  }

  return await animate(visitedNodes, path, 'bidir', start, end);
}
