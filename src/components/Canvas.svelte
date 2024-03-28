<script>
  import { onDestroy, onMount } from "svelte";
  import { renderGraph } from "../graph/render";
  import { getCanvasSize } from "../graph/utils/canvas-size";
  import { graph } from "../stores/graph";
  import { minimap } from "../graph/plugins/minimap";

  import data from "../lib/tests/NSNP_G6_1.json";

  const unsubscribe = graph.subscribe((value) => {});

  onMount(async () => {
    const renderer = localStorage.getItem("renderer") || "canvas";
    const localData = JSON.parse(localStorage.getItem("data"));
    const container = document.getElementById("canvas");
    graph.set(renderGraph(container, getCanvasSize(), localData || data, renderer));

    window.onresize = function () {
      const { width, height } = getCanvasSize();
      $graph.setSize([width, height]);
      $graph.updatePlugin(minimap(
        $graph.getAllEdgesData().length
      ));
    };
  });

  onDestroy(async () => {
    $graph.destroy();
    unsubscribe();
  });
</script>

<div ref="canvas" id="canvas" class="canvas fixed top-0 left-0"></div>

<style global lang="postcss">
  /* canvas styles */
  .canvas {
    @apply w-[100vw] h-[100vh];
  }

  /* Custom minimap styles */
  .g6-minimap-custom {
    @apply absolute bottom-[2.5vh] right-[2.5vw] shadow-lg border-2 border-gray-800/[.10] bg-gray-300/[.20] hidden md:block;
  }

  .g6-minimap-viewport-custom {
    @apply border-2 border-gray-500 bg-gray-300/[.30];
  }

  /* Custom context menu styles */
  .g6-component-contextmenu-custom {
    @apply bg-white rounded-lg border-2 min-w-[30] border-gray-200 shadow-lg;
  }

  .dark .g6-component-contextmenu-custom {
    @apply bg-gray-900;
  }

  .g6-contextmenu-ul-custom {
    @apply py-2 px-2;
  }

  .g6-contextmenu-button-custom {
    @apply flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center;
  }

  .dark .g6-contextmenu-button-custom {
    @apply text-gray-100;
  }

  .g6-contextmenu-button-custom:hover {
    @apply bg-blue-700 text-gray-50;
  }

  .g6-contextmenu-button-custom:active {
    @apply bg-gray-300 text-gray-600;
  }

  .dark .g6-contextmenu-button-custom:active {
    @apply bg-gray-700 text-gray-50;
  }
</style>
