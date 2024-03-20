<script>
  export let id;
  export let graph;

  const layoutConfigs = {
    Circular: () => {
      return {
        type: "circular",
        animated: true,
        linkDistance: 100,
        preventOverlap: true,
        endRadius: $graph.getAllNodesData().length * 50,
      };
    },
    Grid: () => {
      return {
        type: "grid",
        animated: true,
        linkDistance: 100,
        preventOverlap: true,
      };
    },
    Radial: () => {
      const nodeCount = $graph.getAllNodesData().length;
      return {
        type: "radial",
        animated: true,
        linkDistance: nodeCount * 300,
        unitRadius: nodeCount * 80,
        preventOverlap: true,
        strictRadial: true,
        sortStrength: 50,
      };
    },
    Concentric: () => {
      const nodeCount = $graph.getAllNodesData().length;
      return {
        type: "concentric",
        animated: true,
        maxLevelDiff: parseInt(nodeCount * 0.1),
        linkDistance: nodeCount * 300,
        preventOverlap: true,
      };
    },
    MDS: () => {
      return {
        type: "mds",
        animated: true,
        linkDistance: $graph.getAllNodesData().length * 150,
        preventOverlap: true,
      };
    },
  };

  const autoLayout = (layout) => {
    $graph.layout(layout);
    setTimeout(() => {
      $graph.fitView(undefined, {});
    }, 1000);
  };
</script>

<div
  {id}
  class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
>
  <div class="flex flex-col">
    <!-- Circular -->
    <button
      on:click={()=>autoLayout(layoutConfigs.Circular())}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
      <span>Circular</span>
    </button>

    <!-- Grid -->
    <button
      on:click={()=>autoLayout(layoutConfigs.Grid())}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span>Grid</span>
    </button>

    <!-- Concentric -->
    <button
      on:click={()=>autoLayout(layoutConfigs.Concentric())}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
      <span>Concentric</span>
    </button>

    <!-- MDS -->
    <button
      on:click={()=>autoLayout(layoutConfigs.MDS())}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
        <line x1="12" y1="20" x2="12" y2="10"></line>
      </svg>
      <span>MDS</span>
    </button>

    <!-- Radial -->
    <button
      on:click={()=>autoLayout(layoutConfigs.Radial())}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12,3.67A8.33,8.33,0,1,1,3.67,12" transform="translate(-2.92 -2.92)"/>
        <path d="M16.72,13.67A5,5,0,1,1,12,7" transform="translate(-2.92 -2.92)"/>
        <path d="M12,13.67a1.67,1.67,0,0,1,0-3.34,1.64,1.64,0,0,1,1.25.57" transform="translate(-2.92 -2.92)"/>
      </svg>
      <span>Radial</span>
    </button>
  </div>
</div>
