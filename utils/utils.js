// utils/utils.js

let ANIMATION_SPEED = 50; // 0-100 scale

export const setAnimationSpeed = (speed) => {
  ANIMATION_SPEED = speed;
};

export const keyOf = (n) => {
  // Support both grid nodes (with r,c) and graph nodes (with id)
  if (typeof n === 'number') return String(n);
  if (n.r !== undefined && n.c !== undefined) return `${n.r},${n.c}`;
  if (n.id !== undefined) return String(n.id);
  return String(n);
};

export const sleep = (ms) => {
  const speedFactor = (100 - ANIMATION_SPEED) / 100;
  return new Promise((r) => setTimeout(r, ms * speedFactor));
};

export const manhattan  = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
export const euclidean  = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

/**
 * Haversine distance for geographic coordinates
 */
export const haversine = (a, b) => {
  const R = 6371; // Earth's radius in km
  const lat1 = a.lat * (Math.PI / 180);
  const lat2 = b.lat * (Math.PI / 180);
  const dLat = (b.lat - a.lat) * (Math.PI / 180);
  const dLng = (b.lng - a.lng) * (Math.PI / 180);
  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
};

export function neighbors(grid, n) {
  // Support both grid-based and graph-based neighbors
  if (grid instanceof Map) {
    // Graph mode: grid is actually adjacency list map
    return grid.get(n) || [];
  }
  // Grid mode (legacy)
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const res = [];
  for (const [dr, dc] of dirs) {
    const r = n.r + dr, c = n.c + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length)
      res.push(grid[r][c]);
  }
  return res;
}

export function reconstruct(parent, start, end) {
  const path = [];
  let cur = end;
  while (cur && cur !== start) {
    path.push(cur);
    cur = parent.get(keyOf(cur));
  }
  if (cur !== start) return []; // couldn't trace back — no path exists
  return path.reverse();
}

export async function animate(visited, path, type, start, end) {
  for (const n of visited) {
    if (n !== start && n !== end) {
      // Support both grid nodes (with el) and graph nodes (rendered as markers)
      if (n.el) n.el.classList.add(`visited-${type}`);
      await sleep(15);
    }
  }
  for (const n of path) {
    if (n !== start && n !== end) {
      if (n.el) {
        n.el.classList.remove(`visited-${type}`);
        n.el.classList.add(`path-${type}`);
      }
      await sleep(30);
    }
  }
  return { visited, path };
}

export class PriorityQueue {
  constructor(priorityFn) {
    this.items = [];
    this.priorityFn = priorityFn;
  }

  push(item) {
    this.items.push(item);
    this.items.sort((a, b) => this.priorityFn(a) - this.priorityFn(b));
  }

  pop() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  includes(item) {
    return this.items.includes(item);
  }
}
