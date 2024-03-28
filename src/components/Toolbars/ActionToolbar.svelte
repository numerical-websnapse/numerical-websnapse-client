<script>
  import { clearGraph } from "../../graph/actions/graph-action";
  import { changeMode } from "../../stores/graph";
  import { system } from "../../stores/system";
  import { graph } from "../../stores/graph";
  import { tools } from "../../stores/tools";
  import { checkOpenModal, getModal } from "../../stores/modals";

  const openHistory = () => {
    getModal("historyModal").show();
  };

  const onKeydownActions = (e) => {
    if (checkOpenModal()) return;

    switch (e.code) {
      case "KeyS":
        changeMode("default");
        break;
      case "KeyM":
        changeMode("move");
        break;
      case "KeyC":
        if ($system.editing) changeMode("create-node");
        break;
      case "KeyE":
        if ($system.editing) changeMode("edit");
        break;
      case "KeyD":
        if ($system.editing) changeMode("delete");
        break;
      case "KeyA":
        if ($system.editing) changeMode("create-edge");
        break;
      case "KeyH":
        openHistory();
        break;
      case "Delete":
        if ($system.editing) clearGraph();
        break;
    }
  };
</script>

<svelte:window on:keydown={onKeydownActions} />

<div
  class="fixed inline-flex top-[50vh] left-[1.5vw] translate-y-[-50%]"
  class:hidden={!$tools.toolbars.show}
>
  <div class="flex flex-col">
    <!-- History toolbar -->
    <div
      class="flex flex-col flex-wrap items-center justify-between mx-auto space-y-2 rounded-lg border-solid border border-gray-500 bg-white dark:bg-neutral-800 dark:border-neutral-600"
    >
      <!-- History -->
      <button
        on:click={openHistory}
        data-tooltip-target="tooltip-history"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-800 active:bg-blue-800 dark:hover:bg-blue-800 dark:active:ring-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
        >
          <path
            class="cls-1"
            d="M12.9,22.34a9.66,9.66,0,1,0-9.65-9.75"
            transform="translate(-0.11 -2.28)"
          /><polyline
            class="cls-1"
            points="0.75 7.97 2.82 10.68 5.52 8.61"
          /><polyline
            class="cls-1"
            points="12.49 4.9 12.49 11.59 15.53 13.92"
          />
        </svg>
      </button>
      <div
        id="tooltip-history"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        History (H)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>

    <!-- Modes toolbar -->
    <div
      class="flex flex-col flex-wrap items-center justify-between mx-auto mt-2 space-y-2 rounded-lg border-solid border border-gray-500 bg-white dark:bg-neutral-800 dark:border-neutral-600"
    >
      <!-- Select -->
      <button
        on:click={() => changeMode("default")}
        data-tooltip-target="tooltip-select"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        class:active-btn={$system.mode === "default"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
          class:active-svg={$system.mode === "default"}
        >
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path
            d="M13 13l6 6"
          />
        </svg>
      </button>
      <div
        id="tooltip-select"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Select (S)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Create Node -->
      <button
        on:click={() => changeMode("create-node")}
        data-tooltip-target="tooltip-create-node"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        class:active-btn={$system.mode === "create-node"}
        hidden={!$system.editing}
        disabled={!$system.editing}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
          class:active-svg={$system.mode === "create-node"}
          ><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg
        >
      </button>
      <div
        id="tooltip-create-node"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Create Node (C)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Edit -->
      <button
        on:click={() => changeMode("edit")}
        data-tooltip-target="tooltip-edit"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        class:active-btn={$system.mode === "edit"}
        hidden={!$system.editing}
        disabled={!$system.editing}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
          class:active-svg={$system.mode === "edit"}
          ><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          ></path><path
            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          ></path></svg
        >
      </button>
      <div
        id="tooltip-edit"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Edit (E)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Create Edge -->
      <button
        on:click={() => changeMode("create-edge")}
        data-tooltip-target="tooltip-create-edge"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        class:active-btn={$system.mode === "create-edge"}
        hidden={!$system.editing}
        disabled={!$system.editing}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
          class:active-svg={$system.mode === "create-edge"}
          ><path
            d="M5.63574 5.63574V12.7068M5.63574 5.63574H12.7068M5.63574 5.63574L18.3637 18.3637"
          /></svg
        >
      </button>
      <div
        id="tooltip-create-edge"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Create Edge (A)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Move -->
      <button
        on:click={() => changeMode("move")}
        data-tooltip-target="tooltip-move"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        class:active-btn={$system.mode === "move"}
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
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
          class:active-svg={$system.mode === "move"}
        >
          <polyline points="5 9 2 12 5 15"></polyline><polyline
            points="9 5 12 2 15 5"
          ></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline
            points="19 9 22 12 19 15"
          ></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line
            x1="12"
            y1="2"
            x2="12"
            y2="22"
          ></line>
        </svg>
      </button>
      <div
        id="tooltip-move"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Move (M)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Delete -->
      <button
        on:click={() => changeMode("delete")}
        data-tooltip-target="tooltip-delete"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-red-800 dark:hover:bg-red-700"
        class:active-error-btn={$system.mode === "delete"}
        hidden={!$system.editing}
        disabled={!$system.editing}
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
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
          class:active-svg={$system.mode === "delete"}
        >
          <path
            class="st0"
            d="M22.2,9.7l-6.5,6.5l-5.5,5.5l-4.4,0l-4.3-4.3c-0.1-0.1-0.4-0.5-0.4-1.2c0-0.6,0.3-1,0.4-1.2
          c0.8-0.8,3.6-3.6,6.5-6.5c2.9-2.9,5.8-5.8,6.5-6.5c1.2-1,2.3,0,2.3,0l5.3,5.3c0.1,0.1,0.4,0.5,0.4,1.1C22.6,9.1,22.3,9.6,22.2,9.7z"
          />
          <path class="st0" d="M8,8.6c3.9,3.9,7.7,7.6,7.7,7.6L8,8.6z" />
          <path class="st0" d="M15.4,21.7c6.5,0,6.5,0,6.5,0H10.3" />
        </svg>
      </button>
      <div
        id="tooltip-delete"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Delete (D)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>

    <!-- Single-use toolbar -->
    <div
      class="flex flex-col display flex-wrap items-center justify-between mx-auto mt-2 space-y-1 rounded-lg border-solid border border-gray-500 bg-white dark:bg-neutral-800 dark:border-neutral-600"
      class:hidden={!$system.editing}
    >
      <!-- Clear -->
      <button
        on:dblclick={() => clearGraph()}
        data-tooltip-target="tooltip-clear"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-red-800 active:ring-4 active:outline-none active:ring-red-800 active:bg-red-800 dark:hover:bg-red-700 dark:active:ring-red-800"
        disabled={!$system.editing}
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
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
        </svg>
      </button>
      <div
        id="tooltip-clear"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Clear (Double-click)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>

    <!-- Dev-toolbar toolbar -->
    <div
      class="flex flex-col display flex-wrap items-center justify-between mx-auto mt-2 space-y-1 rounded-lg border-solid border border-gray-500 bg-white dark:bg-neutral-800 dark:border-neutral-600"
      class:hidden={!$system.dev || !$system.editing}
    >
      <!-- Trigger edge animations -->
      <button
        on:click={() => {
          $graph.getAllEdgesData().forEach((edge) => {
            if ($graph.getItemState(edge.id, "Spiking"))
              $graph.setItemState(edge.id, "Spiking", false);
            else $graph.setItemState(edge.id, "Spiking", true);
          });
        }}
        data-tooltip-target="tooltip-trigger-edges"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-green-800 active:ring-4 active:outline-none active:ring-green-800 active:bg-green-800 dark:hover:bg-green-700 dark:active:ring-green-800"
        disabled={!$system.editing}
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
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </button>
      <div
        id="tooltip-trigger-edges"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Trigger Edges
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Trigger change graph data -->
      <button
        on:click={() => {
          $graph.getAllNodesData().forEach((node) => {
            const newNode = $graph.getNodeData(node.id);
            if (node.data.ntype === "reg") {
              newNode.data.var_.forEach((v) => {
                v[1] = (Math.random() * 100).toString();
              });
              $graph.updateData("node", newNode);
            }
            // if (node.data.ntype === 'out') {
            //   node.data.train = [];
            //   for(let i = 0; i < 100; i++) {
            //     node.data.train.push(Math.random() * 100);
            //   }
            //   $graph.updateData('node', newNode);
            // }
          });

          // const { node } = $graph.getSpecification();
          // $graph.updateSpecification({ node });
        }}
        data-tooltip-target="tooltip-change-node-data"
        data-tooltip-placement="right"
        class="group rounded-md p-2 bg-white dark:bg-neutral-800 border-0 hover:bg-green-800 active:ring-4 active:outline-none active:ring-green-800 active:bg-green-800 dark:hover:bg-green-700 dark:active:ring-green-800"
        disabled={!$system.editing}
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
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect
            x="9"
            y="9"
            width="6"
            height="6"
          ></rect><line x1="9" y1="1" x2="9" y2="4"></line><line
            x1="15"
            y1="1"
            x2="15"
            y2="4"
          ></line><line x1="9" y1="20" x2="9" y2="23"></line><line
            x1="15"
            y1="20"
            x2="15"
            y2="23"
          ></line><line x1="20" y1="9" x2="23" y2="9"></line><line
            x1="20"
            y1="14"
            x2="23"
            y2="14"
          ></line><line x1="1" y1="9" x2="4" y2="9"></line><line
            x1="1"
            y1="14"
            x2="4"
            y2="14"
          ></line>
        </svg>
      </button>
      <div
        id="tooltip-change-node-data"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Change Node Data
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .active-btn {
    @apply ring-4 outline-none bg-blue-800 ring-blue-800 dark:outline-none dark:bg-blue-800 dark:ring-blue-800;
  }

  .active-error-btn {
    @apply ring-4 outline-none bg-red-800 ring-red-800 dark:outline-none dark:bg-red-800 dark:ring-red-800;
  }

  .active-svg {
    @apply text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100;
  }
</style>
