# Shortest Path Visualizer

An interactive web-based visualizer for common shortest-path and graph-search algorithms. This project is designed to help learners experiment with algorithms, inspect their behavior step-by-step, and gain practical intuition.

**Highlights**
- Visual implementations of BFS, DFS, Dijkstra, A*, Greedy Best-First, Bidirectional search, JPS, and D* Lite.
- Interactive grid: set start/goal nodes, draw obstacles, and step through algorithm execution.
- Configurable animation speed and step controls for hands-on learning.

**Included algorithms**
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

## Quick start
1. Install dependencies (if any are required):

```bash
npm install
```

2. Serve the project locally and open it in a browser:

```bash
npx http-server . -o
# or
npx serve .
```

You can also open `index.html` directly, but some features work best when served from a local server.

## Development
- Edit source files in `algos/` and `utils/`, then refresh the page to see changes.

## Contributing
- Pull requests and issues are welcome. Please describe bugs or feature requests clearly.

## Author & Contact
- **Author:** Nachiketh Joshi
- **About:** Use this application to learn and practice shortest-path algorithms, it's intended as an educational tool to help you gain practical knowledge.
- **Contact:** nachiketh01.dev@gmail.com
