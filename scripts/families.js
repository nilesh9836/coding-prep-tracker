// Problem "families": each is a real, distinct problem. The generator stamps
// category/pattern/difficulty and produces multiple themed variants with
// different titles so the bank reaches 300+ while every question stays valid
// and solvable. Java reference solutions included.

// Themed title pools in the style of the real SWPCT exam.
export const titleThemes = [
  'Product Display', 'Rental Robot Vacuum Cleaner', 'Finding Hidden Pictures', 'Clockwise Rotation',
  'Hopscotch', 'Balancing', 'Running', 'Math Galaxy', 'Creation of a Park', 'Chemical Synthesis',
  'Setting the Exploration Route', 'Planet Travel', 'Removal of Foreign Matter', 'Collection of Parcels',
  'Dividing an Area', 'Warehouse Sorting', 'Signal Relay', 'Island Survey', 'Treasure Map', 'Delivery Drones',
  'Garden Maze', 'Factory Line', 'Subway Network', 'Coin Fountain', 'Puzzle Box', 'Light Grid',
  'Mountain Trail', 'River Crossing', 'Satellite Link', 'Bookshelf Order', 'Ticket Counter',
  'Music Playlist', 'Energy Cells', 'Harbor Docking', 'Painting Walls', 'Maze Runner', 'Data Packets',
  'Orchard Harvest', 'Cable Routing', 'Festival Lights', 'Robot Arm', 'Water Tanks', 'Stock Ticker',
  'Temperature Log', 'Password Vault', 'Elevator Dispatch', 'Parking Lot', 'Card Shuffle', 'Game Board',
  'Spice Market', 'Clock Tower', 'Lab Samples', 'Bridge Builder', 'Pixel Art', 'Snow Plow',
  'Courier Dash', 'Puzzle Lock', 'Grain Silo', 'Signal Tower', 'Taxi Route', 'Vending Machine'
]

// Each family produces a question given a numeric parameter set for variety.
// buildVariant(i) returns a full question object (minus id).
export const families = [
  // ---------- Code Understanding ----------
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Easy',
    count: 18,
    refs: [
      { source: 'Hectal', label: 'DSA basics & loops', url: 'https://hectal.in/dsa' },
      { source: 'GeeksforGeeks', label: 'Output of C/Java programs', url: 'https://www.geeksforgeeks.org/output-of-java-programs/' }
    ],
    build(i) {
      const arr = [[3, 1, 4, 1, 5], [2, 2, 2], [5, 4, 3, 2, 1], [1, 9, 1, 9], [7, 7, 7, 7]][i % 5]
      let acc = 0
      for (const x of arr) { acc += x; if (acc % 2 === 0) acc -= x }
      return {
        statement:
          'Trace the loop and determine the final printed value of acc. Rule: add each element; if acc becomes even, subtract the element just added.',
        codeSnippet: `int[] a = {${arr.join(', ')}};
int acc = 0;
for (int i = 0; i < a.length; i++) {
    acc += a[i];
    if (acc % 2 == 0) acc -= a[i];
}
System.out.println(acc);`,
        examples: [{ input: `a = {${arr.join(',')}}`, output: String(acc), explanation: 'Simulate step by step, applying the parity rule after each add.' }],
        constraints: ['Small positive integers'],
        hints: ['Track acc after every iteration.', 'The subtraction only fires when acc turns even.'],
        approach: 'Directly simulate the loop, applying the subtraction whenever the running sum becomes even.',
        solution: `// Simulating gives acc = ${acc}`,
        complexity: { time: 'O(n)', space: 'O(1)' },
        tags: ['tracing', 'parity', 'loop']
      }
    }
  },
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Medium',
    count: 18,
    refs: [
      { source: 'Hectal', label: 'Recurrences & simulation', url: 'https://hectal.in/dsa' },
      { source: 'LeetCode', label: 'Fibonacci Number', url: 'https://leetcode.com/problems/fibonacci-number/' }
    ],
    build(i) {
      const n = [5, 6, 7, 8, 4][i % 5]
      // compute: fib-like with mod
      let a = 0, b = 1
      for (let k = 0; k < n; k++) { const t = (a + b) % 7; a = b; b = t }
      return {
        statement: `A counter uses a Fibonacci-style recurrence modulo 7. After ${n} iterations starting from a=0,b=1, what is the value of a printed?`,
        codeSnippet: `int a = 0, b = 1;
for (int k = 0; k < ${n}; k++) {
    int t = (a + b) % 7;
    a = b; b = t;
}
System.out.println(a);`,
        examples: [{ input: `iterations = ${n}`, output: String(a), explanation: 'Each step shifts the pair and reduces mod 7.' }],
        constraints: ['Iterations <= 50'],
        hints: ['Track the (a,b) pair each iteration.', 'Reduce mod 7 every step.'],
        approach: 'Simulate the recurrence; after the loop, a holds the second-to-last term.',
        solution: `// After ${n} steps a = ${a}`,
        complexity: { time: 'O(n)', space: 'O(1)' },
        tags: ['tracing', 'recurrence', 'modulo']
      }
    }
  },
  {
    category: 'Code Understanding',
    pattern: 'Code Tracing',
    difficulty: 'Hard',
    count: 14,
    refs: [
      { source: 'Hectal', label: 'String simulation', url: 'https://hectal.in/dsa' },
      { source: 'LeetCode', label: 'Robot Return to Origin', url: 'https://leetcode.com/problems/robot-return-to-origin/' }
    ],
    build(i) {
      const s = ['R2LR', 'RRL3', '3RLL', 'L2R2R', 'RL4R'][i % 5]
      let pos = 0, mult = 1
      for (const c of s) {
        if (c >= '0' && c <= '9') { mult = +c; continue }
        const step = c === 'L' ? -1 : 2
        pos += step * mult
        mult = 1
      }
      return {
        statement:
          'A robot moves on a number line. L=-1, R=+2. A digit d multiplies the next single move by d, then resets. Find the final position.',
        codeSnippet: `String cmd = "${s}";
int pos = 0, mult = 1;
for (char c : cmd.toCharArray()) {
    if (Character.isDigit(c)) { mult = c - '0'; continue; }
    int step = (c == 'L') ? -1 : 2;
    pos += step * mult;
    mult = 1;
}
System.out.println(pos);`,
        examples: [{ input: `cmd = "${s}"`, output: String(pos), explanation: 'Apply the multiplier to the next move only.' }],
        constraints: ['Command length <= 100'],
        hints: ['A digit affects only the immediately following move.', 'Reset the multiplier after each move.'],
        approach: 'Walk the string, applying and resetting the multiplier per move.',
        solution: `// Final position = ${pos}`,
        complexity: { time: 'O(n)', space: 'O(1)' },
        tags: ['tracing', 'simulation', 'string']
      }
    }
  },

  // ---------- Problem Solving 1 ----------
  {
    category: 'Problem Solving_1',
    pattern: 'Two Pointers',
    difficulty: 'Easy',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Two Sum II - Input Array Is Sorted', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
      { source: 'Hectal', label: 'Two pointers', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given a sorted array and a target, return the 1-based indices (i, j) of two elements that sum to the target, or [-1,-1] if none. Use O(1) extra space.',
        examples: [{ input: 'a = [1,3,4,6,8], target = 10', output: '[2,4]', explanation: '3 + 7? use 4+6=10 -> indices 3,4 (1-based).' }],
        constraints: ['2 <= n <= 10^5', 'array sorted ascending'],
        hints: ['Place one pointer at each end.', 'Move the pointer that brings the sum closer to the target.'],
        approach: 'Two pointers from both ends; shrink based on whether the current sum is above or below the target.',
        solution: `int[] twoSumSorted(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int s = a[lo] + a[hi];
        if (s == target) return new int[]{lo + 1, hi + 1};
        if (s < target) lo++; else hi--;
    }
    return new int[]{-1, -1};
}`,
        complexity: { time: 'O(n)', space: 'O(1)' },
        tags: ['two-pointers', 'array']
      }
    }
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Minimum Size Subarray Sum', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' },
      { source: 'Hectal', label: 'Sliding window', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given an array of non-negative integers and a value S, return the length of the shortest contiguous subarray whose sum is >= S, or 0 if none exists.',
        examples: [{ input: 'a = [2,3,1,2,4,3], S = 7', output: '2', explanation: 'Subarray [4,3] has sum 7 with length 2.' }],
        constraints: ['1 <= n <= 10^5', '0 <= a[i] <= 10^4'],
        hints: ['Grow the window to meet the sum, then shrink from the left.', 'Track the minimum valid length.'],
        approach: 'Variable-size sliding window: expand right, and while the window sum >= S, record length and shrink from the left.',
        solution: `int shortestSubarray(int[] a, int S) {
    int left = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int right = 0; right < a.length; right++) {
        sum += a[right];
        while (sum >= S) {
            best = Math.min(best, right - left + 1);
            sum -= a[left++];
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' },
        tags: ['sliding-window', 'array']
      }
    }
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Hashing',
    difficulty: 'Medium',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Longest Consecutive Sequence', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
      { source: 'Hectal', label: 'Hashing', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given an array, return the length of the longest run of consecutive integers (e.g. 3,4,5) formable from its values, regardless of their order in the array.',
        examples: [{ input: 'a = [100,4,200,1,3,2]', output: '4', explanation: 'The run 1,2,3,4 has length 4.' }],
        constraints: ['0 <= n <= 10^5'],
        hints: ['Put everything in a hash set.', 'Only start counting a run at a value with no predecessor.'],
        approach: 'Insert all values into a set. For each value that has no value-1 in the set, walk upward counting the run length.',
        solution: `int longestConsecutive(int[] a) {
    java.util.HashSet<Integer> set = new java.util.HashSet<>();
    for (int x : a) set.add(x);
    int best = 0;
    for (int x : set) {
        if (set.contains(x - 1)) continue;
        int len = 1, cur = x;
        while (set.contains(cur + 1)) { cur++; len++; }
        best = Math.max(best, len);
    }
    return best;
}`,
        complexity: { time: 'O(n)', space: 'O(n)' },
        tags: ['hashing', 'set']
      }
    }
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Binary Search',
    difficulty: 'Medium',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Split Array Largest Sum', url: 'https://leetcode.com/problems/split-array-largest-sum/' },
      { source: 'GeeksforGeeks', label: 'Allocate Minimum Pages', url: 'https://www.geeksforgeeks.org/allocate-minimum-number-pages/' }
    ],
    build() {
      return {
        statement:
          'Books must be printed by workers in a fixed order; worker handles a contiguous block. Given page counts and W workers, minimize the maximum pages any single worker prints (the block partition problem). Return that minimized maximum.',
        examples: [{ input: 'pages = [10,20,30,40], W = 2', output: '60', explanation: 'Split [10,20,30] and [40] -> max 60.' }],
        constraints: ['1 <= W <= n <= 10^5'],
        hints: ['Binary search on the answer (the max load).', 'Greedily count how many workers a candidate limit needs.'],
        approach: 'Binary search the maximum-load value between max(pages) and sum(pages); feasibility checks how many workers a candidate needs.',
        solution: `int minMaxPages(int[] pages, int W) {
    long lo = 0, hi = 0;
    for (int p : pages) { lo = Math.max(lo, p); hi += p; }
    while (lo < hi) {
        long mid = (lo + hi) / 2;
        if (workersNeeded(pages, mid) <= W) hi = mid; else lo = mid + 1;
    }
    return (int) lo;
}
int workersNeeded(int[] pages, long limit) {
    int workers = 1; long cur = 0;
    for (int p : pages) {
        if (cur + p > limit) { workers++; cur = p; }
        else cur += p;
    }
    return workers;
}`,
        complexity: { time: 'O(n log(sum))', space: 'O(1)' },
        tags: ['binary-search', 'partition']
      }
    }
  },
  {
    category: 'Problem Solving_1',
    pattern: 'Greedy',
    difficulty: 'Easy',
    count: 14,
    refs: [
      { source: 'LeetCode', label: 'Non-overlapping Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
      { source: 'Hectal', label: 'Greedy', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'You have intervals [start, end]. Select the maximum number of non-overlapping intervals (an interval ending exactly when another starts does NOT overlap). Return that count.',
        examples: [{ input: 'intervals = [[1,3],[2,4],[3,5]]', output: '2', explanation: 'Pick [1,3] and [3,5].' }],
        constraints: ['1 <= n <= 10^5'],
        hints: ['Sort by end time.', 'Greedily take an interval whose start is >= the last chosen end.'],
        approach: 'Classic activity selection: sort by end, then greedily accept compatible intervals.',
        solution: `int maxNonOverlap(int[][] iv) {
    java.util.Arrays.sort(iv, (x, y) -> Integer.compare(x[1], y[1]));
    int count = 0, lastEnd = Integer.MIN_VALUE;
    for (int[] x : iv) {
        if (x[0] >= lastEnd) { count++; lastEnd = x[1]; }
    }
    return count;
}`,
        complexity: { time: 'O(n log n)', space: 'O(1)' },
        tags: ['greedy', 'intervals']
      }
    }
  },
  {
    category: 'Problem Solving_1',
    pattern: 'String Manipulation',
    difficulty: 'Medium',
    count: 14,
    refs: [
      { source: 'LeetCode', label: 'Palindrome Permutation', url: 'https://leetcode.com/problems/palindrome-permutation/' },
      { source: 'Hectal', label: 'Strings', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given a string, return true if it can be rearranged into a palindrome. A string can form a palindrome if at most one character has an odd frequency.',
        examples: [{ input: 's = "aabb"', output: 'true', explanation: 'Rearranges to "abba".' }],
        constraints: ['1 <= length <= 10^5', 'lowercase letters'],
        hints: ['Count character frequencies.', 'At most one odd count is allowed.'],
        approach: 'Tally frequencies; the string is palindrome-formable iff no more than one character count is odd.',
        solution: `boolean canFormPalindrome(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    int odd = 0;
    for (int f : freq) if (f % 2 == 1) odd++;
    return odd <= 1;
}`,
        complexity: { time: 'O(n)', space: 'O(1)' },
        tags: ['string', 'frequency']
      }
    }
  },

  // ---------- Problem Solving 2 ----------
  {
    category: 'Problem Solving_2',
    pattern: 'Graph BFS/DFS',
    difficulty: 'Hard',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Number of Connected Components', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
      { source: 'Hectal', label: 'Graphs: BFS/DFS', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given an undirected graph with n nodes, count the number of connected components.',
        examples: [{ input: 'n=5, edges=[[0,1],[1,2],[3,4]]', output: '2', explanation: 'Components {0,1,2} and {3,4}.' }],
        constraints: ['1 <= n <= 10^5', '0 <= edges <= 2*10^5'],
        hints: ['Build an adjacency list.', 'Run BFS/DFS from each unvisited node and count launches.'],
        approach: 'Traverse the graph; each new traversal launched from an unvisited node marks one component.',
        solution: `int countComponents(int n, int[][] edges) {
    java.util.List<java.util.List<Integer>> g = new java.util.ArrayList<>();
    for (int i = 0; i < n; i++) g.add(new java.util.ArrayList<>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    boolean[] seen = new boolean[n];
    int comp = 0;
    for (int s = 0; s < n; s++) {
        if (seen[s]) continue;
        comp++;
        java.util.ArrayDeque<Integer> q = new java.util.ArrayDeque<>();
        q.add(s); seen[s] = true;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g.get(u)) if (!seen[v]) { seen[v] = true; q.add(v); }
        }
    }
    return comp;
}`,
        complexity: { time: 'O(n + e)', space: 'O(n + e)' },
        tags: ['graph', 'bfs', 'components']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Matrix Traversal',
    difficulty: 'Medium',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/' },
      { source: 'Hectal', label: 'Matrix / flood fill', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given a grid of 0s (water) and 1s (land), count the number of islands. Cells connect 4-directionally.',
        examples: [{ input: 'grid=[[1,1,0],[0,1,0],[0,0,1]]', output: '2', explanation: 'One island top-left, one bottom-right.' }],
        constraints: ['1 <= rows, cols <= 1000'],
        hints: ['Flood fill each unvisited land cell.', 'Count how many flood fills you launch.'],
        approach: 'Scan the grid; when an unvisited land cell is found, flood fill its whole island and increment the count.',
        solution: `int numIslands(int[][] g) {
    int r = g.length, c = g[0].length, count = 0;
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++)
            if (g[i][j] == 1) { count++; fill(g, i, j); }
    return count;
}
void fill(int[][] g, int i, int j) {
    if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] == 0) return;
    g[i][j] = 0;
    fill(g, i + 1, j); fill(g, i - 1, j); fill(g, i, j + 1); fill(g, i, j - 1);
}`,
        complexity: { time: 'O(r*c)', space: 'O(r*c)' },
        tags: ['matrix', 'flood-fill', 'dfs']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Matrix Rotation',
    difficulty: 'Medium',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Rotate Image', url: 'https://leetcode.com/problems/rotate-image/' },
      { source: 'Hectal', label: 'Matrix rotation', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Rotate an n x n matrix 90 degrees clockwise in place and return it.',
        examples: [{ input: '[[1,2],[3,4]]', output: '[[3,1],[4,2]]', explanation: 'Transpose then reverse each row.' }],
        constraints: ['1 <= n <= 1000'],
        hints: ['Transpose across the main diagonal.', 'Then reverse every row.'],
        approach: 'Transpose the matrix, then reverse each row to achieve a clockwise rotation without extra space.',
        solution: `int[][] rotate(int[][] m) {
    int n = m.length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int t = m[i][j]; m[i][j] = m[j][i]; m[j][i] = t;
        }
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n / 2; j++) {
            int t = m[i][j]; m[i][j] = m[i][n - 1 - j]; m[i][n - 1 - j] = t;
        }
    return m;
}`,
        complexity: { time: 'O(n^2)', space: 'O(1)' },
        tags: ['matrix', 'rotation']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Monotonic Stack',
    difficulty: 'Medium',
    count: 14,
    refs: [
      { source: 'LeetCode', label: 'Daily Temperatures', url: 'https://leetcode.com/problems/daily-temperatures/' },
      { source: 'Hectal', label: 'Monotonic stack', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given daily temperatures, for each day return how many days until a warmer temperature; 0 if none follows.',
        examples: [{ input: 't = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Next warmer day distances.' }],
        constraints: ['1 <= n <= 10^5'],
        hints: ['Keep a stack of indices with decreasing temperatures.', 'Pop when the current day is warmer.'],
        approach: 'Monotonic decreasing stack of indices; when a warmer day arrives, pop and record the index gap.',
        solution: `int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] res = new int[n];
    java.util.ArrayDeque<Integer> st = new java.util.ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && t[i] > t[st.peek()]) {
            int j = st.pop();
            res[j] = i - j;
        }
        st.push(i);
    }
    return res;
}`,
        complexity: { time: 'O(n)', space: 'O(n)' },
        tags: ['monotonic-stack']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Dynamic Programming',
    difficulty: 'Hard',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/' },
      { source: 'Hectal', label: 'Dynamic programming', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given coin denominations and an amount, return the minimum number of coins to make that amount, or -1 if it cannot be made. Each coin may be used unlimited times.',
        examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '5 + 5 + 1 = 11.' }],
        constraints: ['1 <= coins.length <= 50', '0 <= amount <= 10^4'],
        hints: ['dp[x] = fewest coins to make x.', 'Transition over each coin: dp[x] = min(dp[x - coin] + 1).'],
        approach: 'Unbounded knapsack / coin change DP initialized to infinity with dp[0]=0.',
        solution: `int coinChange(int[] coins, int amount) {
    int INF = amount + 1;
    int[] dp = new int[amount + 1];
    java.util.Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        complexity: { time: 'O(amount * coins)', space: 'O(amount)' },
        tags: ['dp', 'coin-change']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Prefix Sum',
    difficulty: 'Medium',
    count: 14,
    refs: [
      { source: 'LeetCode', label: 'Subarray Sum Equals K', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { source: 'Hectal', label: 'Prefix sum', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given an integer array, count the number of contiguous subarrays whose sum equals exactly K.',
        examples: [{ input: 'a = [1,1,1], K = 2', output: '2', explanation: 'Two subarrays sum to 2.' }],
        constraints: ['1 <= n <= 10^5', '-10^9 <= K <= 10^9'],
        hints: ['Use prefix sums with a hash map of counts.', 'For each prefix p, add the count of p-K seen so far.'],
        approach: 'Running prefix sum stored in a hash map; each prefix contributes the number of earlier prefixes equal to prefix-K.',
        solution: `int subarraysWithSum(int[] a, int K) {
    java.util.HashMap<Long, Integer> seen = new java.util.HashMap<>();
    seen.put(0L, 1);
    long prefix = 0; int count = 0;
    for (int x : a) {
        prefix += x;
        count += seen.getOrDefault(prefix - K, 0);
        seen.merge(prefix, 1, Integer::sum);
    }
    return count;
}`,
        complexity: { time: 'O(n)', space: 'O(n)' },
        tags: ['prefix-sum', 'hashing']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'TSP / Backtracking',
    difficulty: 'Hard',
    count: 10,
    refs: [
      { source: 'LeetCode', label: 'N-Queens II', url: 'https://leetcode.com/problems/n-queens-ii/' },
      { source: 'Hectal', label: 'Backtracking', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Place N queens on an N x N board so that none attack each other. Return the number of distinct valid arrangements.',
        examples: [{ input: 'N = 4', output: '2', explanation: 'Two distinct solutions exist for 4-queens.' }],
        constraints: ['1 <= N <= 12'],
        hints: ['Backtrack row by row.', 'Track used columns and both diagonals with sets or bitmasks.'],
        approach: 'Row-by-row backtracking; place a queen in each row in a column not conflicting on column or either diagonal.',
        solution: `int totalNQueens(int n) {
    return solve(0, 0, 0, 0, n);
}
int solve(int row, int cols, int diag1, int diag2, int n) {
    if (row == n) return 1;
    int count = 0;
    int available = ((1 << n) - 1) & ~(cols | diag1 | diag2);
    while (available != 0) {
        int p = available & (-available);
        available -= p;
        count += solve(row + 1, cols | p, (diag1 | p) << 1, (diag2 | p) >> 1, n);
    }
    return count;
}`,
        complexity: { time: 'O(N!)', space: 'O(N)' },
        tags: ['backtracking', 'bitmask']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Sorting',
    difficulty: 'Medium',
    count: 14,
    refs: [
      { source: 'LeetCode', label: 'Meeting Rooms II', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
      { source: 'Hectal', label: 'Sorting & sweep line', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Given start and end times of meetings, return the minimum number of rooms required so that no two meetings overlap in the same room.',
        examples: [{ input: 'meetings=[[0,30],[5,10],[15,20]]', output: '2', explanation: 'The [0,30] overlaps with [5,10].' }],
        constraints: ['1 <= n <= 10^5'],
        hints: ['Separate and sort start and end times.', 'Sweep: a room frees when its end time passes a start.'],
        approach: 'Sort starts and ends; sweep starts, releasing a room whenever the earliest end is <= the current start. Track the peak concurrency.',
        solution: `int minRooms(int[][] meetings) {
    int n = meetings.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) { starts[i] = meetings[i][0]; ends[i] = meetings[i][1]; }
    java.util.Arrays.sort(starts);
    java.util.Arrays.sort(ends);
    int rooms = 0, maxRooms = 0, j = 0;
    for (int i = 0; i < n; i++) {
        while (j < n && ends[j] <= starts[i]) { rooms--; j++; }
        rooms++;
        maxRooms = Math.max(maxRooms, rooms);
    }
    return maxRooms;
}`,
        complexity: { time: 'O(n log n)', space: 'O(n)' },
        tags: ['sorting', 'sweep', 'intervals']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Recursion',
    difficulty: 'Medium',
    count: 16,
    refs: [
      { source: 'LeetCode', label: 'Subsets', url: 'https://leetcode.com/problems/subsets/' },
      { source: 'Hectal', label: 'Recursion & backtracking', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'Generate all subsets (the power set) of a set of distinct integers. Return the total number of subsets and confirm it equals 2^n.',
        examples: [{ input: 'nums = [1,2,3]', output: '8', explanation: '2^3 = 8 subsets including the empty set.' }],
        constraints: ['0 <= n <= 20'],
        hints: ['Recurse choosing include/exclude for each element.', 'The count is 2^n.'],
        approach: 'Backtracking that at each index branches on including or excluding the current element, collecting every subset.',
        solution: `java.util.List<java.util.List<Integer>> subsets(int[] nums) {
    java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();
    backtrack(0, nums, new java.util.ArrayList<>(), res);
    return res;
}
void backtrack(int i, int[] nums, java.util.List<Integer> cur,
               java.util.List<java.util.List<Integer>> res) {
    if (i == nums.length) { res.add(new java.util.ArrayList<>(cur)); return; }
    backtrack(i + 1, nums, cur, res);          // exclude
    cur.add(nums[i]);
    backtrack(i + 1, nums, cur, res);          // include
    cur.remove(cur.size() - 1);
}`,
        complexity: { time: 'O(2^n * n)', space: 'O(n)' },
        tags: ['recursion', 'backtracking', 'subsets']
      }
    }
  },
  {
    category: 'Problem Solving_2',
    pattern: 'Simulation',
    difficulty: 'Medium',
    count: 14,
    refs: [
      { source: 'LeetCode', label: 'Spiral Matrix', url: 'https://leetcode.com/problems/spiral-matrix/' },
      { source: 'Hectal', label: 'Matrix simulation', url: 'https://hectal.in/dsa' }
    ],
    build() {
      return {
        statement:
          'A spiral order traversal of an m x n matrix returns its elements clockwise from the top-left. Return that order as a list.',
        examples: [{ input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Clockwise spiral.' }],
        constraints: ['1 <= m, n <= 1000'],
        hints: ['Maintain four boundaries: top, bottom, left, right.', 'Peel layers inward.'],
        approach: 'Simulate the spiral by shrinking the four boundaries after traversing each edge.',
        solution: `java.util.List<Integer> spiralOrder(int[][] m) {
    java.util.List<Integer> res = new java.util.ArrayList<>();
    int top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) res.add(m[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) res.add(m[i][right]);
        right--;
        if (top <= bottom) { for (int j = right; j >= left; j--) res.add(m[bottom][j]); bottom--; }
        if (left <= right) { for (int i = bottom; i >= top; i--) res.add(m[i][left]); left++; }
    }
    return res;
}`,
        complexity: { time: 'O(m*n)', space: 'O(1)' },
        tags: ['matrix', 'simulation', 'spiral']
      }
    }
  }
]
