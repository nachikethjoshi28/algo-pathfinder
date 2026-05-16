import { runDFS }        from './algos/dfs.js';
import { runBFS }        from './algos/bfs.js';
import { runDijkstra }   from './algos/dijkstra.js';
import { runAStar }      from './algos/astar.js';
import { runGreedy }     from './algos/greedy.js';
import { runDStarLite }  from './algos/dstar_lite.js';
import { runBiDirBFS }   from './algos/bidir_bfs.js';
import { runBiDirAStar } from './algos/bidir_astar.js';
import { runJPS }        from './algos/jps.js';
import { setAnimationSpeed, sleep } from './utils/utils.js';
import { ALGO_EXPLANATIONS } from './utils/explanations.js';

// ---- DOM refs ----
const gridContainer    = document.getElementById('gridContainer');
const gridEl           = document.getElementById('grid');
const graphContainer   = document.getElementById('graphContainer');
const graphSvgEl       = document.getElementById('graphSvg');
const modeSelector     = document.getElementById('modeSelector');
const resetBtn         = document.getElementById('resetMap');
const randomBtn        = document.getElementById('randomPoints');
const speedSlider      = document.getElementById('speedSlider');
const speedValue       = document.getElementById('speedValue');
const dfsBtn           = document.getElementById('runDFS');
const bfsBtn           = document.getElementById('runBFS');
const dijBtn           = document.getElementById('runDijkstra');
const aStarBtn         = document.getElementById('runAStar');
const greedyBtn        = document.getElementById('runGreedy');
const dstarBtn         = document.getElementById('runDStar');
const jpsBtn           = document.getElementById('runJPS');
const biBFSBtn         = document.getElementById('runBiBFS');
const biAStarBtn       = document.getElementById('runBiAStar');
const runAllBtn        = document.getElementById('runAll');
const perfPlaceholder  = document.getElementById('perfPlaceholder');
const perfChartWrapper = document.getElementById('perfChartWrapper');
const perfChartCanvas  = document.getElementById('perfChart');
const pathLengthEl     = document.getElementById('pathLength');
const visitedCountEl   = document.getElementById('visitedCount');
const lastAlgoEl       = document.getElementById('lastAlgo');
const routeSectionEl        = document.getElementById('routeSection');
const routeDisplayEl        = document.getElementById('routeDisplay');
const algoExplanationSection = document.getElementById('algoExplanationSection');
const algoExplanationTitle   = document.getElementById('algoExplanationTitle');
const algoExplanationContent = document.getElementById('algoExplanationContent');
const viewStatsBtn     = document.getElementById('viewStatsBtn');
const statsOverlay     = document.getElementById('statsOverlay');
const statsBackdrop    = document.getElementById('statsBackdrop');
const closeStatsBtn    = document.getElementById('closeStatsBtn');
const noPathToast      = document.getElementById('noPathToast');

// ---- State ----
let isGridMode  = true;
let isGraphMode = false;

// Grid mode
const GRID_ROWS = 24;
const GRID_COLS = 40;
let gridNodeMap = null;
let gridGraph   = null;
let wallSet     = new Set();

// Graph mode
const GRAPH_NUM_NODES = 80;
let graphNodeMap = null;  // Map<nodeId:number, {id, x, y, circleEl, textEl}>
let graphGraph   = null;  // Map<nodeId:number, [{id, distance}]>
let graphEdgeMap = null;  // Map<"minId-maxId", SVGLineElement>

// Shared start/end: string ID in grid mode, number in graph mode
let start = null, end = null;

let perfChart = null;

const ALGO_COLORS = {
  'DFS':      '#6366f1',
  'BFS':      '#3b82f6',
  'Bi-BFS':   '#06b6d4',
  'Dijkstra': '#22c55e',
  'A*':       '#f59e0b',
  'Bi-A*':    '#8b5cf6',
  'Greedy':   '#ec4899',
  'D* Lite':  '#14b8a6',
  'JPS':      '#f97316',
};

const ALGO_CSS = {
  'DFS': 'dfs', 'BFS': 'bfs', 'Dijkstra': 'dijkstra', 'A*': 'astar',
  'Greedy': 'greedy', 'D* Lite': 'dstar', 'JPS': 'jps',
  'Bi-BFS': 'bidir', 'Bi-A*': 'bidir-astar',
};

// ========== GRID MODE ==========

function buildGridMode() {
  isGridMode  = true;
  isGraphMode = false;
  start = end = null;
  wallSet = new Set();

  graphContainer.style.display = 'none';
  gridContainer.style.display  = 'flex';

  gridEl.innerHTML = '';
  gridNodeMap = new Map();
  gridGraph   = new Map();

  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const id = `${r},${c}`;
      const el = document.createElement('div');
      el.className = 'cell';
      el.addEventListener('click', () => handleCellClick(id));
      gridEl.appendChild(el);
      gridNodeMap.set(id, { id, r, c, el });
    }
  }

  rebuildGridGraph();
  randomBtn.textContent = 'Random Walls';
}

function handleCellClick(id) {
  if (!start) {
    start = id;
    const el = gridNodeMap.get(id).el;
    el.classList.add('start');
    el.textContent = '🏠';
  } else if (!end && id !== start) {
    end = id;
    const el = gridNodeMap.get(id).el;
    el.classList.add('end');
    el.textContent = '🏫';
  } else {
    toggleWall(id);
  }
}

function toggleWall(id) {
  if (id === start || id === end) return;
  const node = gridNodeMap.get(id);
  if (!node) return;
  if (wallSet.has(id)) {
    wallSet.delete(id);
    node.el.classList.remove('wall');
  } else {
    wallSet.add(id);
    node.el.classList.add('wall');
  }
  rebuildGridGraph();
}

function rebuildGridGraph() {
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const id = `${r},${c}`;
      if (wallSet.has(id)) {
        gridGraph.set(id, []);
        continue;
      }
      const nbs = [];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        const nid = `${nr},${nc}`;
        if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS && !wallSet.has(nid))
          nbs.push({ id: nid, distance: 1 });
      }
      gridGraph.set(id, nbs);
    }
  }
}

function randomWalls() {
  wallSet.forEach(id => {
    const node = gridNodeMap.get(id);
    if (node) node.el.classList.remove('wall');
  });
  wallSet.clear();

  for (const [id, node] of gridNodeMap) {
    if (id === start || id === end) continue;
    if (Math.random() < 0.28) {
      wallSet.add(id);
      node.el.classList.add('wall');
    }
  }
  rebuildGridGraph();
}

function clearGridVisualization() {
  gridNodeMap.forEach(node => {
    node.el.className = 'cell';
    node.el.textContent = '';
    if (wallSet.has(node.id)) node.el.classList.add('wall');
    if (node.id === start) { node.el.classList.add('start'); node.el.textContent = '🏠'; }
    if (node.id === end)   { node.el.classList.add('end');   node.el.textContent = '🏫'; }
  });
}

async function gridVisualize(visited, path, algoName) {
  const type = ALGO_CSS[algoName] || 'dfs';

  for (const nodeId of visited) {
    if (nodeId === start || nodeId === end) continue;
    const node = gridNodeMap.get(nodeId);
    if (node) { node.el.classList.add(`visited-${type}`); await sleep(5); }
  }

  for (const nodeId of path) {
    if (nodeId === start || nodeId === end) continue;
    const node = gridNodeMap.get(nodeId);
    if (node) {
      node.el.classList.remove(`visited-${type}`);
      node.el.classList.add(`path-${type}`);
      await sleep(10);
    }
  }
}

// ========== GRAPH MODE ==========

function euclidean(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildGraphMode() {
  isGridMode  = false;
  isGraphMode = true;
  start = end = null;

  gridContainer.style.display  = 'none';
  graphContainer.style.display = 'flex';

  randomBtn.textContent = 'Random Graph';
  generateRandomGraph();
}

function generateRandomGraph() {
  start = end = null;

  // Coordinate space matching the SVG viewBox "0 0 860 540"
  const W = 860, H = 540, PAD = 36;
  const N = GRAPH_NUM_NODES;

  // Pick N unique IDs from 1–3000
  const pool = Array.from({ length: 3000 }, (_, i) => i + 1);
  shuffle(pool);
  const nodeIds = pool.slice(0, N);

  // Random positions inside padded viewBox
  const nodes = nodeIds.map(id => ({
    id,
    x: PAD + Math.random() * (W - 2 * PAD),
    y: PAD + Math.random() * (H - 2 * PAD),
  }));

  // K-nearest-neighbour edges (K = 3 or 4 per node, deduplicated)
  const edgeSet = new Map(); // "minId-maxId" -> {from, to, d}
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: euclidean(nodes[i], n) }))
      .filter(e => e.j !== i)
      .sort((a, b) => a.d - b.d);

    const k = 3 + Math.floor(Math.random() * 2);
    for (let m = 0; m < Math.min(k, dists.length); m++) {
      const toId   = nodes[dists[m].j].id;
      const fromId = nodes[i].id;
      const key    = `${Math.min(fromId, toId)}-${Math.max(fromId, toId)}`;
      if (!edgeSet.has(key))
        edgeSet.set(key, { from: fromId, to: toId, d: dists[m].d });
    }
  }

  // Build adjacency structures
  graphNodeMap = new Map();
  graphGraph   = new Map();
  nodes.forEach(n => {
    graphNodeMap.set(n.id, { id: n.id, x: n.x, y: n.y });
    graphGraph.set(n.id, []);
  });

  const edgeList = [];
  for (const e of edgeSet.values()) {
    graphGraph.get(e.from).push({ id: e.to,   distance: e.d });
    graphGraph.get(e.to).push(  { id: e.from, distance: e.d });
    edgeList.push(e);
  }

  // Ensure full connectivity via BFS + bridge edges
  const visited = new Set([nodes[0].id]);
  const queue   = [nodes[0].id];
  while (queue.length) {
    const id = queue.shift();
    for (const nb of graphGraph.get(id) || []) {
      if (!visited.has(nb.id)) { visited.add(nb.id); queue.push(nb.id); }
    }
  }
  for (const n of nodes) {
    if (visited.has(n.id)) continue;
    let nearest = null, minD = Infinity;
    for (const vid of visited) {
      const vn = graphNodeMap.get(vid);
      const d  = euclidean(n, vn);
      if (d < minD) { minD = d; nearest = vid; }
    }
    if (nearest !== null) {
      graphGraph.get(n.id).push(   { id: nearest, distance: minD });
      graphGraph.get(nearest).push({ id: n.id,    distance: minD });
      const key = `${Math.min(n.id, nearest)}-${Math.max(n.id, nearest)}`;
      edgeList.push({ from: n.id, to: nearest, d: minD });
      edgeSet.set(key, { from: n.id, to: nearest, d: minD });
      visited.add(n.id);
    }
  }

  renderGraphSvg(nodes, edgeList);
}

function renderGraphSvg(nodes, edgeList) {
  const NS     = 'http://www.w3.org/2000/svg';
  const NODE_R = 14;
  graphSvgEl.innerHTML = '';
  graphEdgeMap = new Map();

  // Edges (drawn first so nodes appear on top)
  const edgeGroup = document.createElementNS(NS, 'g');
  for (const e of edgeList) {
    const from = graphNodeMap.get(e.from);
    const to   = graphNodeMap.get(e.to);
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', from.x.toFixed(1));
    line.setAttribute('y1', from.y.toFixed(1));
    line.setAttribute('x2', to.x.toFixed(1));
    line.setAttribute('y2', to.y.toFixed(1));
    line.setAttribute('stroke',        '#334155');
    line.setAttribute('stroke-width',  '1.5');
    line.setAttribute('opacity',       '0.7');
    edgeGroup.appendChild(line);

    const key = `${Math.min(e.from, e.to)}-${Math.max(e.from, e.to)}`;
    graphEdgeMap.set(key, line);
  }
  graphSvgEl.appendChild(edgeGroup);

  // Nodes
  const nodeGroup = document.createElementNS(NS, 'g');
  for (const [id, node] of graphNodeMap) {
    const g = document.createElementNS(NS, 'g');
    g.classList.add('graph-node');
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => handleGraphNodeClick(id));

    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx',           node.x.toFixed(1));
    circle.setAttribute('cy',           node.y.toFixed(1));
    circle.setAttribute('r',            NODE_R);
    circle.setAttribute('fill',         '#1e293b');
    circle.setAttribute('stroke',       '#475569');
    circle.setAttribute('stroke-width', '1.5');

    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x',                  node.x.toFixed(1));
    text.setAttribute('y',                  node.y.toFixed(1));
    text.setAttribute('text-anchor',        'middle');
    text.setAttribute('dominant-baseline',  'central');
    text.setAttribute('fill',               '#94a3b8');
    text.setAttribute('font-size',          '9');
    text.setAttribute('font-weight',        '600');
    text.setAttribute('font-family',        'monospace');
    text.setAttribute('pointer-events',     'none');
    text.textContent = id;

    g.appendChild(circle);
    g.appendChild(text);
    nodeGroup.appendChild(g);

    node.circleEl = circle;
    node.textEl   = text;
  }
  graphSvgEl.appendChild(nodeGroup);
}

function handleGraphNodeClick(id) {
  if (!start) {
    start = id;
    setGraphNodeStyle(id, 'start');
  } else if (!end && id !== start) {
    end = id;
    setGraphNodeStyle(id, 'end');
  }
}

function setGraphNodeStyle(id, state) {
  const node = graphNodeMap.get(id);
  if (!node?.circleEl) return;
  if (state === 'start') {
    node.circleEl.setAttribute('fill',         '#facc15');
    node.circleEl.setAttribute('stroke',       '#fbbf24');
    node.circleEl.setAttribute('stroke-width', '2.5');
    node.circleEl.setAttribute('opacity',      '1');
    node.textEl.setAttribute('fill',           '#0f172a');
    node.textEl.setAttribute('font-size',      '13');
    node.textEl.textContent = '🏠';
  } else if (state === 'end') {
    node.circleEl.setAttribute('fill',         '#ef4444');
    node.circleEl.setAttribute('stroke',       '#dc2626');
    node.circleEl.setAttribute('stroke-width', '2.5');
    node.circleEl.setAttribute('opacity',      '1');
    node.textEl.setAttribute('fill',           '#ffffff');
    node.textEl.setAttribute('font-size',      '13');
    node.textEl.textContent = '🏫';
  } else {
    node.circleEl.setAttribute('fill',         '#1e293b');
    node.circleEl.setAttribute('stroke',       '#475569');
    node.circleEl.setAttribute('stroke-width', '1.5');
    node.circleEl.setAttribute('opacity',      '1');
    node.textEl.setAttribute('fill',           '#94a3b8');
    node.textEl.setAttribute('font-size',      '9');
    node.textEl.textContent = id;
  }
}

function clearGraphVisualization() {
  if (!graphNodeMap) return;
  for (const [id] of graphNodeMap) {
    if      (id === start) setGraphNodeStyle(id, 'start');
    else if (id === end)   setGraphNodeStyle(id, 'end');
    else                   setGraphNodeStyle(id, 'default');
  }
  if (graphEdgeMap) {
    graphEdgeMap.forEach(line => {
      line.setAttribute('stroke',       '#334155');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('opacity',      '0.7');
    });
  }
}

async function graphVisualize(visited, path, algoName) {
  const color = ALGO_COLORS[algoName] || '#94a3b8';

  for (const nodeId of visited) {
    if (nodeId === start || nodeId === end) continue;
    const node = graphNodeMap.get(nodeId);
    if (!node?.circleEl) continue;
    node.circleEl.setAttribute('fill',         color);
    node.circleEl.setAttribute('stroke',       color);
    node.circleEl.setAttribute('stroke-width', '1.5');
    node.circleEl.setAttribute('opacity',      '0.55');
    node.textEl.setAttribute('fill',           '#0f172a');
    await sleep(15);
  }

  if (path.length > 0 && start !== null) {
    const fullPath = [start, ...path];
    for (let i = 0; i + 1 < fullPath.length; i++) {
      const a   = fullPath[i];
      const b   = fullPath[i + 1];
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
      const ln  = graphEdgeMap?.get(key);
      if (ln) {
        ln.setAttribute('stroke',       color);
        ln.setAttribute('stroke-width', '4');
        ln.setAttribute('opacity',      '1');
      }
    }
  }

  for (const nodeId of path) {
    if (nodeId === start || nodeId === end) continue;
    const node = graphNodeMap.get(nodeId);
    if (!node?.circleEl) continue;
    node.circleEl.setAttribute('fill',         color);
    node.circleEl.setAttribute('stroke',       '#ffffff');
    node.circleEl.setAttribute('stroke-width', '2.5');
    node.circleEl.setAttribute('opacity',      '1');
    node.textEl.setAttribute('fill',           '#0f172a');
    await sleep(30);
  }
}

// ========== CHARACTER ANIMATION ==========

async function animateGridCharacter(fullPath) {
  document.getElementById('gridPathChar')?.remove();
  if (!fullPath || fullPath.length < 2) return;

  const cell00 = gridNodeMap.get('0,0');
  if (!cell00) return;
  const r0 = cell00.el.getBoundingClientRect();
  const rc = gridContainer.getBoundingClientRect();
  const gx0 = r0.left - rc.left;
  const gy0 = r0.top  - rc.top + gridContainer.scrollTop;

  const char = document.createElement('div');
  char.id = 'gridPathChar';
  char.style.cssText = 'position:absolute;font-size:15px;line-height:1;z-index:10;pointer-events:none;transform:translate(-50%,-50%);filter:drop-shadow(0 1px 4px rgba(0,0,0,0.6));transition:none;';
  char.textContent = '🚗';
  gridContainer.appendChild(char);

  const sn = gridNodeMap.get(fullPath[0]);
  char.style.left = (gx0 + sn.c * 21 + 10) + 'px';
  char.style.top  = (gy0 + sn.r * 21 + 10) + 'px';
  void char.offsetWidth; // force reflow before enabling transition
  char.style.transition = 'left 0.09s linear, top 0.09s linear';

  let prevC = sn.c;
  for (let i = 1; i < fullPath.length; i++) {
    const node = gridNodeMap.get(fullPath[i]);
    if (!node) continue;
    // Flip car when moving left
    char.style.transform = `translate(-50%,-50%) scaleX(${node.c < prevC ? -1 : 1})`;
    char.style.left = (gx0 + node.c * 23 + 11) + 'px';
    char.style.top  = (gy0 + node.r * 23 + 11) + 'px';
    prevC = node.c;
    await new Promise(r => setTimeout(r, 100));
  }

  await new Promise(r => setTimeout(r, 700));
  char.remove();
}

async function animateGraphCharacter(fullPath) {
  document.getElementById('svgPathChar')?.remove();
  if (!fullPath || fullPath.length < 2) return;

  const NS = 'http://www.w3.org/2000/svg';
  const charGroup = document.createElementNS(NS, 'g');
  charGroup.id = 'svgPathChar';
  charGroup.setAttribute('pointer-events', 'none');

  const charText = document.createElementNS(NS, 'text');
  charText.textContent = '🚗';
  charText.setAttribute('font-size',         '22');
  charText.setAttribute('text-anchor',       'middle');
  charText.setAttribute('dominant-baseline', 'central');
  charText.setAttribute('pointer-events',    'none');
  charGroup.appendChild(charText);
  graphSvgEl.appendChild(charGroup);

  const sn = graphNodeMap.get(fullPath[0]);
  charGroup.setAttribute('transform', `translate(${sn.x.toFixed(1)},${sn.y.toFixed(1)})`);
  await new Promise(r => setTimeout(r, 50));

  const STEPS = 10, STEP_MS = 18;
  for (let i = 0; i + 1 < fullPath.length; i++) {
    const from = graphNodeMap.get(fullPath[i]);
    const to   = graphNodeMap.get(fullPath[i + 1]);
    if (!from || !to) continue;
    // Flip car when moving left
    charText.setAttribute('transform', `scale(${to.x < from.x - 5 ? -1 : 1},1)`);
    for (let s = 1; s <= STEPS; s++) {
      const t = s / STEPS;
      charGroup.setAttribute('transform',
        `translate(${(from.x + (to.x - from.x) * t).toFixed(1)},${(from.y + (to.y - from.y) * t).toFixed(1)})`);
      await new Promise(r => setTimeout(r, STEP_MS));
    }
  }

  await new Promise(r => setTimeout(r, 700));
  charGroup.remove();
}

// ========== LOAD MODE ==========

function loadMode(modeName) {
  start = end = null;
  resetStatsUI();

  if (modeName === 'Grid') {
    buildGridMode();
  } else {
    buildGraphMode();
  }
}

// ========== CONTROLS ==========

speedSlider.addEventListener('input', e => {
  const val = parseInt(e.target.value);
  speedValue.textContent = val + '%';
  setAnimationSpeed(val);
});

modeSelector.addEventListener('change', e => loadMode(e.target.value));

resetBtn.addEventListener('click', () => {
  document.getElementById('gridPathChar')?.remove();
  document.getElementById('svgPathChar')?.remove();
  if (isGridMode) {
    start = end = null;
    clearGridVisualization();
  } else {
    start = end = null;
    clearGraphVisualization();
  }
  resetStatsUI();
});

randomBtn.addEventListener('click', () => {
  if (isGridMode) {
    clearGridVisualization();
    resetStatsUI();
    randomWalls();
  } else {
    clearGraphVisualization();
    resetStatsUI();
    generateRandomGraph();
  }
});

// ========== RUN ALGORITHM ==========

async function runAlgoVisual(algoName, algoFn, skipAnimation = false) {
  if (!start || !end) { alert('Set Start and End points first!'); return null; }

  if (isGridMode) {
    clearGridVisualization();
    const savedSpeed = parseInt(speedSlider.value);
    setAnimationSpeed(100);
    const result = await algoFn(gridGraph, start, end, null);
    setAnimationSpeed(savedSpeed);
    updateStats(algoName, result, null);
    if (result?.visited && result?.path) {
      await gridVisualize(result.visited, result.path, algoName);
      if (!skipAnimation && result.path.length > 0) {
        await animateGridCharacter([start, ...result.path]);
        openStats();
      }
    }
    return result;
  }

  // Graph mode
  clearGraphVisualization();
  const savedSpeed = parseInt(speedSlider.value);
  setAnimationSpeed(100);
  const result = await algoFn(graphGraph, start, end, null);
  setAnimationSpeed(savedSpeed);
  const fullRoute = result?.path ? [start, ...result.path] : null;
  updateStats(algoName, result, fullRoute);
  if (result?.visited && result?.path) {
    await graphVisualize(result.visited, result.path, algoName);
    if (!skipAnimation && result.path.length > 0) {
      await animateGraphCharacter(fullRoute);
      openStats();
    }
  }
  return result;
}

dfsBtn.addEventListener(    'click', () => runAlgoVisual('DFS',      runDFS));
bfsBtn.addEventListener(    'click', () => runAlgoVisual('BFS',      runBFS));
dijBtn.addEventListener(    'click', () => runAlgoVisual('Dijkstra', runDijkstra));
aStarBtn.addEventListener(  'click', () => runAlgoVisual('A*',       runAStar));
greedyBtn.addEventListener( 'click', () => runAlgoVisual('Greedy',   runGreedy));
dstarBtn.addEventListener(  'click', () => runAlgoVisual('D* Lite',  runDStarLite));
jpsBtn.addEventListener(    'click', () => runAlgoVisual('JPS',      runJPS));
biBFSBtn.addEventListener(  'click', () => runAlgoVisual('Bi-BFS',   runBiDirBFS));
biAStarBtn.addEventListener('click', () => runAlgoVisual('Bi-A*',    runBiDirAStar));

runAllBtn.addEventListener('click', async () => {
  if (!start || !end) { alert('Set Start and End points first!'); return; }

  const algos = [
    { name: 'DFS',      fn: runDFS },
    { name: 'BFS',      fn: runBFS },
    { name: 'Bi-BFS',   fn: runBiDirBFS },
    { name: 'Dijkstra', fn: runDijkstra },
    { name: 'A*',       fn: runAStar },
    { name: 'Bi-A*',    fn: runBiDirAStar },
    { name: 'Greedy',   fn: runGreedy },
    { name: 'D* Lite',  fn: runDStarLite },
    { name: 'JPS',      fn: runJPS },
  ];

  const timings = {};
  for (const { name, fn } of algos) {
    const t0 = performance.now();
    await runAlgoVisual(name, fn, true);
    timings[name] = (performance.now() - t0).toFixed(1);
  }

  renderPerfChart(timings);
  openStats();
});

// ========== STATS ==========

function updateStats(name, result, fullRoute) {
  lastAlgoEl.textContent     = name;
  visitedCountEl.textContent = result?.visited?.length ?? '—';
  pathLengthEl.textContent   = result?.path?.length    ?? '—';

  if (isGraphMode && routeSectionEl && routeDisplayEl) {
    routeSectionEl.style.display = 'block';
    if (fullRoute && fullRoute.length > 0) {
      routeDisplayEl.textContent = fullRoute.join(' → ');
    } else {
      routeDisplayEl.textContent = 'No route found';
    }
  } else if (routeSectionEl) {
    routeSectionEl.style.display = 'none';
  }

  // Algorithm explanation
  if (algoExplanationSection && algoExplanationContent) {
    const html = ALGO_EXPLANATIONS[name];
    if (html) {
      algoExplanationTitle.textContent = `About: ${name}`;
      algoExplanationContent.innerHTML = html;
      algoExplanationSection.style.display = 'block';
    } else {
      algoExplanationSection.style.display = 'none';
    }
  }

  if ((result?.visited?.length ?? 0) > 0 && (result?.path?.length ?? 0) === 0) showNoPath();
}

function resetStatsUI() {
  pathLengthEl.textContent   = '—';
  visitedCountEl.textContent = '—';
  lastAlgoEl.textContent     = '—';
  if (routeDisplayEl) routeDisplayEl.textContent = '—';
  if (routeSectionEl) routeSectionEl.style.display = 'none';
  if (algoExplanationSection) algoExplanationSection.style.display = 'none';
  if (perfChart) { perfChart.destroy(); perfChart = null; }
  perfPlaceholder.classList.remove('hidden');
  perfChartWrapper.classList.add('hidden');
}

let toastTimer = null;
function showNoPath() {
  clearTimeout(toastTimer);
  noPathToast.classList.add('show');
  toastTimer = setTimeout(() => noPathToast.classList.remove('show'), 3000);
}

function renderPerfChart(timings) {
  if (perfChart) perfChart.destroy();
  perfPlaceholder.classList.add('hidden');
  perfChartWrapper.classList.remove('hidden');

  const labels = Object.keys(timings);
  const colors = labels.map(l => ALGO_COLORS[l] || '#94a3b8');

  perfChart = new Chart(perfChartCanvas.getContext('2d'), {
    type: 'bar',
    data: { labels, datasets: [{ data: Object.values(timings), backgroundColor: colors,
              borderColor: colors, borderWidth: 2, borderRadius: 6 }] },
    options: {
      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.parsed.x + ' ms' } } },
      scales: {
        x: { beginAtZero: true, ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } },
        y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } }
      }
    }
  });
}

function openStats() { statsOverlay.style.display = 'flex'; }
function closeStats() { statsOverlay.style.display = 'none'; }

viewStatsBtn.addEventListener('click', openStats);
closeStatsBtn.addEventListener('click', closeStats);
statsBackdrop.addEventListener('click', closeStats);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeStats(); });

// ========== INIT ==========

window.addEventListener('load', () => { loadMode('Grid'); });
