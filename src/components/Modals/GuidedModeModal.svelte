<script>
  import { graph } from "../../stores/graph";
  import { system } from "../../stores/system";
  import { MathToSvgElement } from "../../utils/math";
  import { modals, getModal } from "../../stores/modals";
  import FunctionSelect from "./inputs/FunctionSelect.svelte";

  const hideModal = () => {
    getModal("guidedModal").hide();
  };

  const showModal = () => {
    getModal("guidedModal").show();
  };

  const focusNode = (nodeId) => {
    hideModal();

    $graph.focusItem(nodeId, {
      easing: "ease-in",
      duration: 1000,
    });

    setTimeout(() => {
      $graph.zoomTo(3, undefined, {
        easing: "ease-in",
      });
    }, 1000);

    setTimeout(() => {
      showModal();
    }, 3000);
  };

  const toggleRandom = (nodeId) => {
    const value = $system.choice.random[nodeId];
    $system.choice.random[nodeId] = value ? 0 : 1;
  };

  $: counter = $system.choice.active.length ? 0 : null;

  const incrementCounter = () => counter++;

  const nodeData = (neuron, data) => {
    return $graph.getNodeData(neuron).data[data];
  };
</script>

<!-- Main modal -->
<div
  id={$modals.guidedModal}
  tabindex="-1"
  aria-hidden="true"
  class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0"
>
  <div class="relative max-h-full w-full max-w-2xl">
    <!-- Modal content -->
    <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div
        class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
        id="guided-modal-tab"
        data-tabs-toggle="#guided-modal-content"
        role="tablist"
      >
        <ul class="flex flex-wrap flex-justify-between -mb-px">
          <li class="me-2">
            <a
              id="guided-tab"
              data-tabs-target="#guided"
              role="tab"
              arial-controls="guided"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >Selection</a
            >
          </li>
          <li class="flex-grow">
            <!-- For button padding -->
          </li>
          <li class="me-4 mt-3">
            <button
              type="button"
              on:click={hideModal}
              class="{$modals.guided
                .cancelButton} ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                class="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </li>
        </ul>
      </div>
      <!-- Modal Body: tabs -->
      <div id="guided-modal-content">
        <!-- Node action content -->
        <div
          class="hidden dark:bg-gray-800"
          id="guided"
          role="tabpanel"
          aria-labelledby="guided-tab"
        >
          <div class="space-y-6 p-6">
            <!-- Choice Editor -->
            {#if $system.choice.active.length && $system.choice.spike}
              <div
                class="grid grid-cols-1 p-4 sm:grid-cols-3 gap-4 max-h-[45vh] overflow-y-auto"
              >
                {#each $system.order.nrn_ord as neuron}
                  {#if nodeData(neuron, "ntype") === "reg"}
                    <div
                      class="border p-4 rounded-lg border-gray-500"
                      class:hidden={nodeData(neuron, "prf").length < 2}
                    >
                      <!-- Node Details -->
                      <div
                        class="flex flex-row h-max mb-2 items-center dark:bg-gray-800 dark:text-white"
                      >
                        {@html MathToSvgElement(
                          nodeData(neuron, "label"),
                          { class: "node-label" }
                        )}
                        <div class="flex-grow"></div>
                        <span class="text-xs text-gray-400"
                          >{$graph.getNodeData(neuron).id}</span
                        >
                      </div>
                      <div class="relative">
                        <FunctionSelect
                          id={neuron}
                          prfs={nodeData(neuron, "prf")}
                          counter={incrementCounter}
                        />
                      </div>
                      <div
                        class="flex flex-row h-max pt-2 items-center gap-2 dark:bg-gray-800 dark:text-white"
                      >
                        <button
                          on:click={() => focusNode(neuron)}
                          class="w-full flex items-center rounded-lg border h-4 border-gray-300 text-sm dark:border-gray-500 p-2 text-gray-900 dark:text-white"
                        >
                          <span class="flex-grow">Focus</span>
                        </button>
                        <button
                          on:click={() => toggleRandom(neuron)}
                          class:is-random={$system.choice.random[neuron]}
                          class="w-full flex items-center rounded-lg border h-4 border-gray-300 text-sm dark:border-gray-500 p-2 text-gray-900 dark:text-white"
                        >
                          <span class="flex-grow">Random</span>
                        </button>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Modal footer -->
      <div
        class="flex items-center space-x-2 rtl:space-x-reverse rounded-b border-t border-gray-200 p-6 dark:border-gray-600"
      >
        <div class="flex-grow">
          <!-- For button padding -->
        </div>
        <button
          type="button"
          id={$modals.guided.submitButton}
          class="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          on:click={() => hideModal()}
        >
          Submit
        </button>
        <button
          on:click={() => hideModal()}
          type="button"
          class="{$modals.guided
            .cancelButton} rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .node-label {
    @apply w-40 h-40 text-black dark:text-white;
  }

  .is-random {
    @apply bg-blue-400 border border-blue-800;
  }
</style>
