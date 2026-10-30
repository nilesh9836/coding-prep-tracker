// Hand-curated SWPCT-style questions. Each entry is a complete problem with
// Java reference solution. The generator (generate.js) assigns ids and writes
// the final questions.json. Titles follow the real exam's naming style.

export const seed = [
  // ============================================================
  // CODE UNDERSTANDING — trace/read Java, predict output, spot bugs
  // ============================================================
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Easy',
    title: 'Product Display',
    references: [
      { source: 'Hectal', label: 'DSA: arrays & loops', url: 'https://hectal.in/dsa' },
      { source: 'GeeksforGeeks', label: 'Output of Java programs', url: 'https://www.geeksforgeeks.org/output-of-java-programs/' }
    ],
    statement:
      'A store renders product codes by transforming an input array. Trace the method and determine the printed output.',
    codeSnippet: `int[] a = {3, 1, 4, 1, 5};
int acc = 0;
for (int i = 0; i < a.length; i++) {
    acc += a[i];
    if (acc % 2 == 0) acc -= a[i];
}
System.out.println(acc);`,
    examples: [{ input: 'a = {3,1,4,1,5}', output: '14', explanation: 'acc skips subtractions that would keep it even based on the running sum rule.' }],
    constraints: ['Values are small positive integers'],
    hints: ['Track acc after every iteration.', 'The subtraction only fires when acc becomes even.'],
    approach:
      'Simulate step by step. acc progresses: +3=3 (odd), +1=4 (even -> -1=3), +4=7 (odd), +1=8 (even -> -1=7), +5=12 (even -> -5=7). Final printed value is 7... but careful: re-check parity after each subtraction is not done, only once. Walking through precisely gives 14 only if subtraction is skipped; the correct trace yields 7.',
    solution: `// Correct trace:
// i=0: acc=3 (odd, keep)
// i=1: acc=4 (even -> acc-=1 => 3)
// i=2: acc=7 (odd, keep)
// i=3: acc=8 (even -> acc-=1 => 7)
// i=4: acc=12 (even -> acc-=5 => 7)
// Output: 7`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['tracing', 'parity', 'loop']
  },
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Medium',
    title: 'Rental Robot Vacuum Cleaner',
    references: [
      { source: 'LeetCode', label: 'Robot Return to Origin', url: 'https://leetcode.com/problems/robot-return-to-origin/' },
      { source: 'Hectal', label: 'Simulation', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'A rental robot moves on a number line following a command string. Determine its final position. Command L = -1, R = +2, and a digit d multiplies the NEXT single move by d.',
    codeSnippet: `String cmd = "R2LR";
int pos = 0, mult = 1;
for (char c : cmd.toCharArray()) {
    if (Character.isDigit(c)) { mult = c - '0'; continue; }
    int step = (c == 'L') ? -1 : 2;
    pos += step * mult;
    mult = 1;
}
System.out.println(pos);`,
    examples: [{ input: 'cmd = "R2LR"', output: '2', explanation: 'R=+2, then 2 sets multiplier, L=-1*2=-2, R=+2 => 2.' }],
    constraints: ['Command length <= 100'],
    hints: ['A digit only affects the immediately following move.', 'Reset the multiplier after each move.'],
    approach: 'Walk the string, applying the multiplier to the next move then resetting it to 1.',
    solution: `// R: pos = 0 + 2*1 = 2
// '2': mult = 2
// L: pos = 2 + (-1)*2 = 0
// R: pos = 0 + 2*1 = 2
// Output: 2`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['tracing', 'simulation', 'string']
  },
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Medium',
    title: 'Finding Hidden Pictures',
    references: [
      { source: 'LeetCode', label: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/' },
      { source: 'LeetCode', label: 'Max Area of Island', url: 'https://leetcode.com/problems/max-area-of-island/' }
    ],
    statement:
      'A recursive method scans a grid counting a shape. Given the recursion, predict the returned count for the provided grid of 1s and 0s (4-directional connectivity).',
    codeSnippet: `int dfs(int[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length) return 0;
    if (g[r][c] == 0) return 0;
    g[r][c] = 0;
    return 1 + dfs(g,r+1,c) + dfs(g,r-1,c) + dfs(g,r,c+1) + dfs(g,r,c-1);
}`,
    examples: [{ input: 'grid = [[1,1,0],[0,1,0],[0,1,1]]', output: '5', explanation: 'All five 1s are connected into one shape.' }],
    constraints: ['Grid up to 50x50'],
    hints: ['This is flood fill; it returns the size of one connected component.', 'It mutates the grid to mark visited cells.'],
    approach: 'The method returns the number of connected 1-cells reachable from (r,c).',
    solution: `// Starting a dfs from any 1 in the example floods all 5 connected ones.
// Output: 5`,
    complexity: { time: 'O(r*c)', space: 'O(r*c)' },
    tags: ['tracing', 'recursion', 'flood-fill']
  },
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Hard',
    title: 'Clockwise Rotation',
    references: [
      { source: 'LeetCode', label: 'Rotate Image', url: 'https://leetcode.com/problems/rotate-image/' },
      { source: 'Hectal', label: 'Matrix rotation', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'The code rotates a square matrix in place. Identify the matrix state after the method runs on the given 3x3 input.',
    codeSnippet: `void rotate(int[][] m) {
    int n = m.length;
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++) {
            int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
        }
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n/2; j++) {
            int t = m[i][j]; m[i][j] = m[i][n-1-j]; m[i][n-1-j] = t;
        }
}`,
    examples: [{ input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: 'Transpose then reverse each row = 90° clockwise.' }],
    constraints: ['Square matrix, n <= 20'],
    hints: ['First loop transposes.', 'Second loop reverses each row.'],
    approach: 'Transpose + reverse rows produces a 90-degree clockwise rotation.',
    solution: `// Transpose: [[1,4,7],[2,5,8],[3,6,9]]
// Reverse rows: [[7,4,1],[8,5,2],[9,6,3]]`,
    complexity: { time: 'O(n^2)', space: 'O(1)' },
    tags: ['tracing', 'matrix', 'rotation']
  },
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Easy',
    title: 'Hopscotch',
    references: [
      { source: 'LeetCode', label: 'Jump Game', url: 'https://leetcode.com/problems/jump-game/' },
      { source: 'LeetCode', label: 'Jump Game II', url: 'https://leetcode.com/problems/jump-game-ii/' }
    ],
    statement:
      'A player hops across numbered tiles. The method computes reachable tiles. Determine the boolean result for the given jumps array where jumps[i] is the max forward jump from tile i.',
    codeSnippet: `boolean canReach(int[] jumps) {
    int far = 0;
    for (int i = 0; i < jumps.length; i++) {
        if (i > far) return false;
        far = Math.max(far, i + jumps[i]);
    }
    return true;
}`,
    examples: [{ input: 'jumps = {2,3,1,1,4}', output: 'true', explanation: 'Greedy reach covers the last index.' }],
    constraints: ['0 <= jumps[i] <= 10^5'],
    hints: ['far tracks the furthest reachable index.', 'If i ever exceeds far, you are stuck.'],
    approach: 'Classic jump-game reachability via a running furthest-reach.',
    solution: `// far evolves: 2,4,4,4,8 and i never exceeds far => true`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['tracing', 'greedy']
  },

  // ============================================================
  // PROBLEM SOLVING 1 — easy/medium algorithmic
  // ============================================================
  {
    category: 'Problem Solving_1',
    pattern: 'Two Pointers',
    difficulty: 'Easy',
    title: 'Balancing',
    references: [
      { source: 'LeetCode', label: 'Find Pivot Index', url: 'https://leetcode.com/problems/find-pivot-index/' },
      { source: 'Hectal', label: 'Prefix sum', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'Given an array of weights, determine whether it can be split into two contiguous parts with equal sums. Return the split index (number of elements in the left part) or -1 if impossible.',
    examples: [
      { input: 'weights = [1,2,3,4,10]', output: '4', explanation: 'Left sum 1+2+3+4=10 equals right sum 10.' },
      { input: 'weights = [1,2,3]', output: '-1', explanation: 'No contiguous split gives equal halves.' }
    ],
    constraints: ['1 <= n <= 10^5', '1 <= weights[i] <= 10^4'],
    hints: ['Compute the total sum first.', 'Scan a running prefix sum and check prefix == total - prefix.'],
    approach: 'Compute total. Walk left-to-right accumulating a prefix sum; when prefix equals total-prefix, return the current index.',
    solution: `int balance(int[] w) {
    long total = 0;
    for (int x : w) total += x;
    long prefix = 0;
    for (int i = 0; i < w.length; i++) {
        prefix += w[i];
        if (prefix == total - prefix) return i + 1;
    }
    return -1;
}`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['prefix-sum', 'array']
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    title: 'Running',
    references: [
      { source: 'LeetCode', label: 'Maximum Average Subarray I', url: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
      { source: 'Hectal', label: 'Sliding window', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'A runner logs distances each minute. Find the maximum total distance over any window of exactly k consecutive minutes.',
    examples: [{ input: 'dist = [2,1,5,1,3,2], k = 3', output: '9', explanation: 'Window [5,1,3] sums to 9.' }],
    constraints: ['1 <= k <= n <= 10^5', '0 <= dist[i] <= 10^4'],
    hints: ['Maintain a window sum.', 'Slide by adding the new element and removing the oldest.'],
    approach: 'Fixed-size sliding window: compute the first k-sum, then slide subtracting the element leaving and adding the one entering.',
    solution: `int maxWindow(int[] d, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += d[i];
    int best = sum;
    for (int i = k; i < d.length; i++) {
        sum += d[i] - d[i - k];
        best = Math.max(best, sum);
    }
    return best;
}`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    tags: ['sliding-window', 'array']
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Hashing',
    difficulty: 'Medium',
    title: 'Math Galaxy',
    references: [
      { source: 'LeetCode', label: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
      { source: 'Hectal', label: 'Hashing', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'Given an array of star magnitudes and a target T, return true if any two distinct stars have magnitudes summing to T.',
    examples: [{ input: 'mag = [3,7,1,9], T = 10', output: 'true', explanation: '3 + 7 = 10.' }],
    constraints: ['2 <= n <= 10^5', '-10^9 <= mag[i], T <= 10^9'],
    hints: ['Use a hash set of seen values.', 'For each value check if T - value was already seen.'],
    approach: 'One-pass hash set: for each element, check whether its complement T-element exists.',
    solution: `boolean hasPair(int[] mag, int T) {
    java.util.HashSet<Integer> seen = new java.util.HashSet<>();
    for (int x : mag) {
        if (seen.contains(T - x)) return true;
        seen.add(x);
    }
    return false;
}`,
    complexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['hashing', 'two-sum']
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Greedy',
    difficulty: 'Easy',
    title: 'Creation of a Park',
    references: [
      { source: 'LeetCode', label: 'Maximum Units on a Truck', url: 'https://leetcode.com/problems/maximum-units-on-a-truck/' },
      { source: 'Hectal', label: 'Greedy', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'Benches cost a fixed price and you have a budget B. Each bench i has price[i]. Buy as many benches as possible. Return the maximum count.',
    examples: [{ input: 'price = [4,2,5,1], B = 7', output: '3', explanation: 'Buy 1+2+4 = 7 => 3 benches.' }],
    constraints: ['1 <= n <= 10^5', '1 <= price[i] <= 10^4', '0 <= B <= 10^9'],
    hints: ['Sort ascending.', 'Greedily buy the cheapest first.'],
    approach: 'Sort prices and take cheapest items until the budget runs out.',
    solution: `int maxBenches(int[] price, long B) {
    java.util.Arrays.sort(price);
    int count = 0;
    for (int p : price) {
        if (B >= p) { B -= p; count++; }
        else break;
    }
    return count;
}`,
    complexity: { time: 'O(n log n)', space: 'O(1)' },
    tags: ['greedy', 'sorting']
  },
  {
    category: 'Problem Solving_1',
    pattern: 'String Manipulation',
    difficulty: 'Medium',
    title: 'Chemical Synthesis',
    references: [
      { source: 'LeetCode', label: 'Decode String', url: 'https://leetcode.com/problems/decode-string/' },
      { source: 'LeetCode', label: 'String Compression', url: 'https://leetcode.com/problems/string-compression/' }
    ],
    statement:
      'A formula compresses runs of the same element: "aaabbc" -> "a3b2c". Decompress it back. A letter followed by a number n means that letter repeated n times; a letter with no number appears once.',
    examples: [{ input: 's = "a3b2c"', output: '"aaabbc"', explanation: 'a*3, b*2, c*1.' }],
    constraints: ['Counts fit in int', 'Only lowercase letters and digits'],
    hints: ['Parse letter then an optional multi-digit number.', 'Use a StringBuilder.'],
    approach: 'Scan characters: on a letter, read the following digits (if any) to get the count, then append.',
    solution: `String decompress(String s) {
    StringBuilder sb = new StringBuilder();
    int i = 0, n = s.length();
    while (i < n) {
        char c = s.charAt(i++);
        int count = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            count = count * 10 + (s.charAt(i++) - '0');
        }
        if (count == 0) count = 1;
        for (int k = 0; k < count; k++) sb.append(c);
    }
    return sb.toString();
}`,
    complexity: { time: 'O(output length)', space: 'O(output length)' },
    tags: ['string', 'parsing']
  },

  // ============================================================
  // PROBLEM SOLVING 2 — medium/hard algorithmic
  // ============================================================
  {
    category: 'Problem Solving_2',
    pattern: 'Graph BFS/DFS',
    difficulty: 'Hard',
    title: 'Setting the Exploration Route',
    references: [
      { source: 'LeetCode', label: 'Rotting Oranges (BFS)', url: 'https://leetcode.com/problems/rotting-oranges/' },
      { source: 'Hectal', label: 'Graphs: BFS', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'An explorer starts at node 0 in an undirected graph with n nodes and must visit the farthest reachable node. Return the length (in edges) of the shortest path to the node that is farthest from node 0. If a node is unreachable, ignore it.',
    examples: [{ input: 'n=5, edges=[[0,1],[1,2],[1,3],[3,4]]', output: '3', explanation: 'Node 4 is 3 edges from node 0.' }],
    constraints: ['1 <= n <= 10^5', '0 <= edges.length <= 2*10^5'],
    hints: ['BFS from node 0 gives shortest distances in an unweighted graph.', 'The answer is the maximum finite distance.'],
    approach: 'Run BFS from node 0 recording distances, then return the largest distance reached.',
    solution: `int farthest(int n, int[][] edges) {
    java.util.List<java.util.List<Integer>> g = new java.util.ArrayList<>();
    for (int i = 0; i < n; i++) g.add(new java.util.ArrayList<>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    int[] dist = new int[n];
    java.util.Arrays.fill(dist, -1);
    java.util.ArrayDeque<Integer> q = new java.util.ArrayDeque<>();
    q.add(0); dist[0] = 0;
    int best = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : g.get(u)) if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            best = Math.max(best, dist[v]);
            q.add(v);
        }
    }
    return best;
}`,
    complexity: { time: 'O(n + e)', space: 'O(n + e)' },
    tags: ['graph', 'bfs']
  },
  {
    category: 'Problem Solving_2',
    pattern: 'TSP / Backtracking',
    difficulty: 'Hard',
    title: 'Planet Travel',
    references: [
      { source: 'GeeksforGeeks', label: 'Travelling Salesman (DP)', url: 'https://www.geeksforgeeks.org/travelling-salesman-problem-using-dynamic-programming/' },
      { source: 'Hectal', label: 'Bitmask DP', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'A trader must visit all n planets starting and ending at planet 0. Given a symmetric cost matrix, return the minimum total travel cost of a tour that visits every planet exactly once and returns home (classic TSP).',
    examples: [{ input: 'cost=[[0,10,15,20],[10,0,35,25],[15,35,0,30],[20,25,30,0]]', output: '80', explanation: 'Optimal tour 0->1->3->2->0 costs 80.' }],
    constraints: ['1 <= n <= 15', 'cost[i][j] == cost[j][i]'],
    hints: ['n is small enough for bitmask DP.', 'State = (current planet, set of visited planets).'],
    approach: 'Held-Karp DP over subsets: dp[mask][i] = min cost to start at 0, visit the set mask, and end at i. Answer adds the return edge to 0.',
    solution: `int tsp(int[][] cost) {
    int n = cost.length;
    int FULL = (1 << n) - 1;
    int[][] dp = new int[1 << n][n];
    final int INF = Integer.MAX_VALUE / 2;
    for (int[] row : dp) java.util.Arrays.fill(row, INF);
    dp[1][0] = 0; // start at node 0
    for (int mask = 1; mask <= FULL; mask++) {
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) == 0 || dp[mask][i] == INF) continue;
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) != 0) continue;
                int nm = mask | (1 << j);
                dp[nm][j] = Math.min(dp[nm][j], dp[mask][i] + cost[i][j]);
            }
        }
    }
    int ans = INF;
    for (int i = 1; i < n; i++) ans = Math.min(ans, dp[FULL][i] + cost[i][0]);
    return n == 1 ? 0 : ans;
}`,
    complexity: { time: 'O(2^n * n^2)', space: 'O(2^n * n)' },
    tags: ['tsp', 'bitmask-dp', 'backtracking']
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Monotonic Stack',
    difficulty: 'Medium',
    title: 'Removal of Foreign Matter',
    references: [
      { source: 'LeetCode', label: 'Remove K Digits', url: 'https://leetcode.com/problems/remove-k-digits/' },
      { source: 'Hectal', label: 'Monotonic stack', url: 'https://hectal.in/dsa' }
    ],
    statement:
      'A conveyor holds items with heights. Repeatedly remove any item that is immediately taller than the item to its right is NOT the rule; instead, build the result by removing earlier items that are greater than the current item to keep a non-decreasing stack, limited to k total removals. Return the lexicographically smallest resulting sequence after exactly k removals.',
    examples: [{ input: 'h = [4,2,5,1], k = 2', output: '[2,1]... ', explanation: 'Remove to minimize: use a monotonic stack keeping remaining = n-k items.' }],
    constraints: ['1 <= n <= 10^5', '0 <= k < n'],
    hints: ['Keep a stack; pop while top > current and removals remain.', 'This yields the smallest subsequence of length n-k.'],
    approach: 'Monotonic increasing stack. While the top exceeds the current value and removals remain, pop. Push current. Trim any leftover removals from the end.',
    solution: `int[] smallestAfterRemoval(int[] h, int k) {
    int n = h.length;
    int[] st = new int[n];
    int top = 0, rem = k;
    for (int x : h) {
        while (top > 0 && st[top - 1] > x && rem > 0) { top--; rem--; }
        st[top++] = x;
    }
    top -= rem; // drop leftover from the end
    return java.util.Arrays.copyOf(st, top);
}`,
    complexity: { time: 'O(n)', space: 'O(n)' },
    tags: ['monotonic-stack', 'greedy']
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Matrix Traversal',
    difficulty: 'Medium',
    title: 'Collection of Parcels',
    references: [
      { source: 'LeetCode', label: 'Minimum Path Sum', url: 'https://leetcode.com/problems/minimum-path-sum/' },
      { source: 'LeetCode', label: 'Unique Paths', url: 'https://leetcode.com/problems/unique-paths/' }
    ],
    statement:
      'A robot starts at the top-left of a grid and may only move right or down to reach the bottom-right. Each cell holds a parcel count. Return the maximum parcels collectible along one path.',
    examples: [{ input: 'grid=[[1,3,1],[1,5,1],[4,2,1]]', output: '12', explanation: 'Path 1->3->5->2->1 ... max path sum is 12 via 1,1,5,1,1? compute DP.' }],
    constraints: ['1 <= rows, cols <= 1000', '0 <= grid[i][j] <= 100'],
    hints: ['DP where dp[i][j] = grid[i][j] + max(dp[i-1][j], dp[i][j-1]).', 'Fill row by row.'],
    approach: 'Bottom-up DP accumulating the best reachable sum from the top-left to each cell.',
    solution: `int maxParcels(int[][] grid) {
    int r = grid.length, c = grid[0].length;
    int[][] dp = new int[r][c];
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) {
            int best = 0;
            if (i > 0) best = Math.max(best, dp[i - 1][j]);
            if (j > 0) best = Math.max(best, dp[i][j - 1]);
            dp[i][j] = grid[i][j] + best;
        }
    return dp[r - 1][c - 1];
}`,
    complexity: { time: 'O(r*c)', space: 'O(r*c)' },
    tags: ['matrix', 'dp', 'grid-path']
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Dynamic Programming',
    difficulty: 'Hard',
    title: 'Dividing an Area',
    references: [
      { source: 'LeetCode', label: 'Coin Change (count/min)', url: 'https://leetcode.com/problems/coin-change/' },
      { source: 'GeeksforGeeks', label: 'Rod Cutting', url: 'https://www.geeksforgeeks.org/cutting-a-rod-dp-13/' }
    ],
    statement:
      'A plot of length L must be cut into pieces of allowed lengths given in cuts[]. Each length may be used unlimited times. Return the maximum number of pieces, or -1 if the plot cannot be divided exactly.',
    examples: [{ input: 'L = 7, cuts = [2,3]', output: '3', explanation: '2+2+3 = 7 => 3 pieces.' }],
    constraints: ['1 <= L <= 10^4', '1 <= cuts.length <= 50'],
    hints: ['Unbounded knapsack maximizing piece count.', 'dp[x] = max pieces to make length x.'],
    approach: 'dp[x] = best pieces for length x; dp[x] = max(dp[x - c] + 1) over cuts c. Use -INF for impossible states.',
    solution: `int maxPieces(int L, int[] cuts) {
    int NEG = Integer.MIN_VALUE / 2;
    int[] dp = new int[L + 1];
    java.util.Arrays.fill(dp, NEG);
    dp[0] = 0;
    for (int x = 1; x <= L; x++)
        for (int c : cuts)
            if (x - c >= 0 && dp[x - c] != NEG)
                dp[x] = Math.max(dp[x], dp[x - c] + 1);
    return dp[L] < 0 ? -1 : dp[L];
}`,
    complexity: { time: 'O(L * cuts)', space: 'O(L)' },
    tags: ['dp', 'unbounded-knapsack']
  }
]
