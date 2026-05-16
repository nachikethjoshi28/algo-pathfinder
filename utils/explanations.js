export const ALGO_EXPLANATIONS = {

'DFS': `
<h4>Introduction</h4>
<p>Depth-First Search is one of the oldest graph traversal algorithms, with roots in 19th-century maze-solving strategies. It explores a graph by committing fully to one direction before backtracking, making it simple to implement and powerful for a wide range of problems beyond basic pathfinding.</p>
<h4>How It Works</h4>
<p>Starting from the source node, DFS marks it as visited and immediately dives into one unvisited neighbor, recursively repeating the process. When it reaches a dead end — a node with no unvisited neighbors — it backtracks to the most recent node that still has unexplored paths and tries the next option. This continues until the destination is found or all reachable nodes are exhausted. DFS uses a stack internally, either the call stack in recursive form or an explicit stack in iterative form. It does not guarantee the shortest path — it finds a valid route, but may take a longer one due to its depth-biased exploration.</p>
<h4>Why It Is Used</h4>
<p>DFS is valued for its low memory footprint — it only holds the current path in memory, unlike BFS which stores the entire frontier. It is essential for cycle detection, topological sorting of dependency graphs, finding strongly connected components, and exhaustively enumerating all paths between two nodes.</p>
<h4>Real-Life Applications</h4>
<p>Compilers use DFS to resolve module dependencies and parse syntax trees. Garbage collectors trace live object reference graphs using DFS. Game engines use it for procedural maze and dungeon generation. Git uses DFS-style traversal for commit history and merge-base detection. Constraint solvers for Sudoku and scheduling problems use DFS with backtracking to prune invalid solution branches.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O(V + E)</span>
`,

'BFS': `
<h4>Introduction</h4>
<p>Breadth-First Search explores a graph level by level, radiating outward from the source like ripples on water. Developed by Konrad Zuse in 1945 and independently by Edward Moore in 1959, BFS is celebrated for its simplicity and its guarantee of finding the shortest path by edge count in any unweighted graph.</p>
<h4>How It Works</h4>
<p>BFS uses a queue to process nodes in the order they are discovered. The source is enqueued first. At each step, the front node is dequeued, all its unvisited neighbors are marked and enqueued. This layer-by-layer expansion ensures every node at distance k is visited before any node at distance k+1. Because of this ordering, the first time BFS reaches the destination it has done so via the fewest possible edges — guaranteeing the shortest hop-count path.</p>
<h4>Why It Is Used</h4>
<p>BFS is both optimal and complete for unweighted shortest-path problems — it always finds a solution if one exists, and that solution uses the minimum number of steps. It also serves as the conceptual foundation for Dijkstra's algorithm and bidirectional search variants. BFS is equally useful for computing connected components and generating spanning trees.</p>
<h4>Real-Life Applications</h4>
<p>Social networks use BFS to compute degrees of separation between users. GPS systems use it to find the nearest point of interest. Web crawlers index pages breadth-first for broad coverage before depth. Peer-to-peer broadcasting protocols use BFS to propagate messages across network nodes. Puzzle solvers for sliding tiles and board games use BFS to find the minimum number of moves to reach a solution.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O(V + E)</span>
`,

'Dijkstra': `
<h4>Introduction</h4>
<p>Dijkstra's algorithm, conceived by Edsger W. Dijkstra in 1956, is the gold standard for shortest paths in weighted graphs with non-negative edge weights. Dijkstra reportedly designed it in twenty minutes. Decades later it still powers the routing protocols of the internet and navigation apps used by billions daily.</p>
<h4>How It Works</h4>
<p>The algorithm maintains a priority queue ordered by the total known cost from the source. It begins with the source at cost zero and all others at infinity. At each step it dequeues the lowest-cost node and examines its neighbors — if a cheaper route to a neighbor is found through the current node, its cost is updated (relaxed) and it is re-enqueued. Once a node is dequeued its distance is final and optimal. The process repeats until the destination is dequeued or all reachable nodes are settled.</p>
<h4>Why It Is Used</h4>
<p>Dijkstra's produces the true shortest path by total accumulated weight — critical when edges represent real costs like travel time, fuel, or bandwidth. It is provably optimal for all graphs with non-negative weights and scales well to large graphs with an efficient priority queue implementation.</p>
<h4>Real-Life Applications</h4>
<p>Internet routing protocol OSPF runs Dijkstra's on the router network to compute optimal forwarding tables in real time. Google Maps, Waze, and Apple Maps use Dijkstra's variants to compute driving routes. Airline systems use it for minimum-cost flight connections. Video games use it for weighted terrain navigation where different surfaces cost different amounts to cross.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O((V + E) log V)</span>
`,

'A*': `
<h4>Introduction</h4>
<p>A* was developed in 1968 by Peter Hart, Nils Nilsson, and Bertram Raphael at Stanford. It is widely regarded as the most important pathfinding algorithm ever created — combining Dijkstra's optimality with heuristic-guided efficiency. A* finds the shortest path while exploring far fewer nodes than Dijkstra's, making it the dominant choice for real-time pathfinding worldwide.</p>
<h4>How It Works</h4>
<p>Each node is scored using f(n) = g(n) + h(n), where g(n) is the actual cost from the start and h(n) is a heuristic estimate of the remaining cost to the goal. The node with the lowest f value is always expanded next. On grids, Manhattan or Euclidean distance to the goal is used as h(n). When the heuristic is admissible — never overestimates — A* is guaranteed to find the optimal path. Setting h(n) = 0 reduces A* to Dijkstra's algorithm.</p>
<h4>Why It Is Used</h4>
<p>A* is optimal, complete, and significantly faster than Dijkstra's because the heuristic focuses the search toward the goal. It is flexible — the same algorithm works on grids, road networks, and abstract state spaces wherever a meaningful distance estimate can be defined.</p>
<h4>Real-Life Applications</h4>
<p>A* powers NPC navigation in major video games including Age of Empires, Warcraft III, and StarCraft. Robotics systems use it to plan collision-free paths through obstacle fields. Mapping services use A* variants for driving route computation. AI planning systems apply it to logistics and scheduling. Natural language processing uses A* for sequence alignment and machine translation decoding.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O((V + E) log V)</span>
`,

'Greedy': `
<h4>Introduction</h4>
<p>Greedy Best-First Search always moves toward whatever node looks closest to the goal according to the heuristic, without considering how much it cost to reach the current node. It trades the optimality of A* for raw speed — in open environments it can reach the goal very quickly, though the path found may not be the shortest.</p>
<h4>How It Works</h4>
<p>The priority queue is ordered solely by h(n) — the estimated remaining distance to the goal — with no accounting for g(n), the cost already paid. This creates an aggressive beeline toward the destination. The downside is tunnel vision: the algorithm can be misled by the heuristic into a dead end, requiring backtracking and potentially producing a suboptimal path. In sparse, open environments it often outperforms A* in speed; in cluttered environments its performance can degrade significantly compared to A*.</p>
<h4>Why It Is Used</h4>
<p>Greedy Best-First is chosen when finding any reasonable path quickly is more important than finding the best path. It is useful as a performance baseline — comparing its results against A* quantifies exactly how much optimality costs in a given environment. Its simplicity also makes it easy to implement and debug.</p>
<h4>Real-Life Applications</h4>
<p>Game AI for ambient or low-priority NPCs uses Greedy Best-First because those characters just need to head toward a target without requiring a globally optimal route. Robotics prototypes use it during early testing when computation budgets are tight. Structured warehouse environments with predictable layouts use it for fast robot routing. Greedy token selection also appears in language model text generation and machine translation beam search.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O(V log V)</span>
`,

'Bi-BFS': `
<h4>Introduction</h4>
<p>Bidirectional BFS runs two simultaneous BFS searches — one forward from the source and one backward from the destination — meeting in the middle. The key insight is that two small expanding frontiers cover the same reachable space as one large frontier at dramatically lower cost, exploiting the exponential relationship between frontier size and depth.</p>
<h4>How It Works</h4>
<p>Two queues expand alternately; at each step the smaller frontier is advanced by one level. Both searches track visited nodes and parents for path reconstruction. The algorithm terminates when a node appears in both visited sets — this is the meeting point. The shortest path is reconstructed by joining the forward path from source to meeting point with the backward path from meeting point to destination. A correct implementation verifies the meeting point yields the globally optimal path.</p>
<h4>Why It Is Used</h4>
<p>Standard BFS explores O(b^d) nodes for a path of depth d with branching factor b. Bidirectional BFS explores approximately O(2·b^(d/2)) — halving the exponent. On large graphs this translates to an exponential speedup. It requires no heuristic, only a well-defined reverse graph, making it broadly applicable.</p>
<h4>Real-Life Applications</h4>
<p>Large-scale route-finding engines use bidirectional search to compute paths across road networks with millions of nodes in milliseconds. Social platforms compute degrees of separation using bidirectional BFS across billions of edges. Multi-modal transit planners use it for connection finding. Game engines apply it to long-range pathfinding on large maps where single-direction BFS would be too slow.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O(b^(d/2)) practical — O(V + E) worst case</span>
`,

'Bi-A*': `
<h4>Introduction</h4>
<p>Bidirectional A* runs two simultaneous A* searches from both endpoints, guided by heuristics pointing inward from each side. It is more complex than Bidirectional BFS because reversed heuristics behave differently and a careful termination condition is needed to guarantee the optimal meeting point has been identified.</p>
<h4>How It Works</h4>
<p>A forward A* search expands toward the goal using a forward heuristic; a backward A* expands toward the start using a backward heuristic. Both maintain their own open lists ordered by f-scores. At each step the search with the lower frontier minimum is advanced. When a node is settled by both searches a candidate path is recorded. Termination requires checking that no cheaper path can still emerge from either open list before confirming the result.</p>
<h4>Why It Is Used</h4>
<p>Bidirectional A* typically achieves 50–80% fewer node expansions than standard A* on large graphs, since each frontier only needs to expand halfway and the heuristic guides both inward. It is the basis for production-grade routing algorithms like ALT (A* with Landmarks and Triangle inequality) used in major mapping services.</p>
<h4>Real-Life Applications</h4>
<p>Advanced GPS navigation systems use Bidirectional A* to compute continental driving routes in milliseconds. Robotics path planning in high-dimensional spaces uses it for efficient arm and mobile platform navigation. Open-world game engines use it for long-range NPC paths. Multi-hop transit journey planners use it across large rail and bus networks to find optimal connections.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O((V + E) log V)</span>
`,

'D* Lite': `
<h4>Introduction</h4>
<p>D* Lite (Koenig & Likhachev, 2002) solves pathfinding in partially unknown or dynamically changing environments. Rather than recomputing from scratch when the map changes, it incrementally repairs the existing plan — updating only the portions affected by each change. It is the successor to the original D* algorithm and is more computationally efficient.</p>
<h4>How It Works</h4>
<p>D* Lite begins with a backward search from goal to start, similar to A*. The agent then moves along the planned path. As it travels and discovers environmental changes — blocked corridors, new obstacles, altered terrain costs — D* Lite identifies the affected edges, re-relaxes only those nodes, and propagates the updates locally. The cost of each replanning step scales with the magnitude of the change, not the size of the entire map, making real-time replanning practical even on large grids.</p>
<h4>Why It Is Used</h4>
<p>D* Lite is the algorithm of choice whenever the environment is dynamic or only partially observable at planning time. Static algorithms like A* would need to restart entirely on each map change — prohibitively expensive for robots operating in the real world where surprises are constant.</p>
<h4>Real-Life Applications</h4>
<p>NASA Mars rovers use D* family algorithms for autonomous surface navigation across unknown Martian terrain. Autonomous ground vehicles reroute in real time when unexpected obstacles appear. Drone flight systems use incremental replanning for dynamic airspace changes. Warehouse robots reroute when human workers or other agents block planned corridors. Search-and-rescue robots continuously adapt plans in collapsed structures.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O((V+E) log V) initial — O(k log V) per replanning</span>
`,

'JPS': `
<h4>Introduction</h4>
<p>Jump Point Search (Harabor & Grastien, AAAI 2011) is a highly optimized variant of A* specifically designed for uniform-cost grid maps. By identifying and exploiting geometric symmetries in the grid, JPS skips vast numbers of nodes that standard A* would examine — typically running 10 to 100 times faster on real game maps while still producing the same optimal path.</p>
<h4>How It Works</h4>
<p>JPS prunes symmetric paths — routes that cost the same but take different detours around the same obstacle. Instead of expanding every neighbor, it jumps along straight lines and diagonals until hitting an obstacle or a forced neighbor: a node that cannot be reached optimally without passing through the current jump point. Only these special nodes are added to the open list. The result is an open list orders of magnitude smaller than A*'s, with identical path quality.</p>
<h4>Why It Is Used</h4>
<p>JPS is a drop-in replacement for grid-based A* requiring no preprocessing and no extra memory structures. On uniform-cost grids it offers massive speed improvements, making it the standard choice wherever real-time performance is critical and the environment is a grid.</p>
<h4>Real-Life Applications</h4>
<p>JPS was adopted by major real-time strategy game studios after its 2011 publication, including for StarCraft II, where hundreds of units must path simultaneously without frame-rate impact. Robotics occupancy grid navigation uses JPS for fast planning on LIDAR-generated maps. Automated warehouse management systems route ground robots on grid floor plans using JPS. Multi-agent pathfinding research uses it as an efficient single-agent subroutine within cooperative planning frameworks.</p>
<h4>Time Complexity</h4>
<span class="algo-complexity">O((V+E) log V) worst case — far faster in practice</span>
`

};
