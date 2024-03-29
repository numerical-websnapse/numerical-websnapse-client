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
        radius: $graph.getAllNodesData().length * 50,
        startRadius: null,
        endRadius: null,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        clockwise: true,
        divisions: 1,
        ordering: null,
        angleRatio: 1,
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
      return {
        type: 'radial',
        unitRadius: 500,
        linkDistance: 200,
        animated: true,
      };
    },
    Concentric: () => {
      const nodeCount = $graph.getAllNodesData().length;
      return {
        type: 'circular',
        radius: null,
        startRadius: 10,
        endRadius: nodeCount*75,
        divisions: 1,
        startAngle: 0,
        endAngle: Math.PI * Math.ceil(nodeCount/15),
      };
    },
    MDS: () => {
      return {
        type: "mds",
        animated: true,
        linkDistance: 400,
        preventOverlap: true,
      };
    },
    Force: () => {
      return {
        type: 'force',
        maxSpeed: 1000,
        linkDistance: 600,
        animated: false,
      };
    },
    Map: () => {
      return {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 10;
        },
        getWidth: () => {
          return 100;
        },
        getVGap: () => {
          return 150;
        },
        getHGap: () => {
          return 100;
        },
        getSide: undefined,
      };
    },
  };

  const autoLayout = (layout) => {
    $graph.layout(layout);
    setTimeout(() => {
      $graph.fitView(undefined, {});
      $graph.layout({type: 'init'});
    }, 1000);
  };
</script>

<div
  {id}
  class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
>
  <div class="flex flex-col">

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

    <!-- Mind Map -->
    <button
      on:click={()=>autoLayout(layoutConfigs.Map())}
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
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
      <span>Mind Map</span>
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
        <circle cx="12" cy="12" r="2"></circle>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
      </svg>
      <span>Radial</span>
    </button>

    <!-- Force -->
    <button
      on:click={()=>autoLayout(layoutConfigs.Force())}
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
        <circle cx="18" cy="18" r="3"></circle>
        <circle cx="6" cy="6" r="3"></circle>
        <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
        <line x1="6" y1="9" x2="6" y2="21"></line>
      </svg>
      <span>Force</span>
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

  </div>
</div>
