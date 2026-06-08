# Shortest Path Visualizer

A small web project demonstrating common shortest-path and search algorithms with visualizations.

Features
- Visual implementations of BFS, DFS, Dijkstra, A*, Greedy Best-First, Bidirectional search, JPS, D* Lite
- Interactive grid where you can set start, goal, and obstacles
- Step-through visualization and animation controls

Included algorithms
- See the `algos/` folder for implementations:
  - `astar.js`
  - `bfs.js`
  - `bidir_astar.js`
  - `bidir_bfs.js`
  - `dfs.js`
  - `dijkstra.js`
  - `dstar_lite.js`
  - `greedy.js`
  - `jps.js`

Quick start
1. Install dependencies (if the project uses any):

```bash
npm install
```

2. Open the app in a browser:

Option A — simple file serve:

```bash
npx http-server . -o
# or
npx serve .
```

Option B — open `index.html` directly in your browser (some features may require a local server).

Development
- Edit source files in the `algos/` and `utils/` folders and refresh the page.

Contributing
- Pull requests are welcome. Please open issues for bugs or feature requests.

License
- MIT

Credits
- Algorithm implementations in `algos/`.
