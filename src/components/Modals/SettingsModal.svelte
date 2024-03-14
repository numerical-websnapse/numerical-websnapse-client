<script>
  import SettingSidebar from "./sidebar/SettingSidebar.svelte";

  import { onDestroy } from "svelte";
  import { graph } from "../../stores/graph";
  import { ExtGraph } from "../../graph/render";
  import { modals, getModal } from "../../stores/modals";
  import { nodeOptions, edgeOptions } from "../../stores/settings";
  import { nodeState, edgeState } from "../../graph/config";
  import { deepCopy } from "../../utils/copy";

  /*G6 has a bug where item specifications are replaced with its item states specification
  - We need to remove the "states" from the specification to prevent this
  See patches for fix*/
  const nodeOptUnsubcribe = nodeOptions.subscribe((value) => {
    if($graph instanceof ExtGraph) {
      const spec = $graph.getSpecification();
      delete spec.nodeState;
      delete spec.edgeState;
      $graph.updateSpecification(spec);
      $graph.updateStateConfig('node', nodeState());
    }
  });

  const edgeOptUnsubcribe = edgeOptions.subscribe((value) => {
    if($graph instanceof ExtGraph) {
      const spec = $graph.getSpecification();
      delete spec.nodeState;
      delete spec.edgeState;
      $graph.updateSpecification(spec);
      $graph.updateStateConfig('edge', edgeState());
    }
  });

  onDestroy(async () => {
    nodeOptUnsubcribe();
    edgeOptUnsubcribe();
  });

  const hideModal = () => {
    getModal("settingModal").hide();
  };

  const initNodeOptions = deepCopy($nodeOptions);
  const initEdgeOptions = deepCopy($edgeOptions);
  $: tempNodeOptions = deepCopy($nodeOptions);
  $: tempEdgeOptions = deepCopy($edgeOptions);
  
  const matchOptions = () => {
    tempNodeOptions = deepCopy($nodeOptions);
    tempEdgeOptions = deepCopy($edgeOptions);
  }

  const resetOptions = () => {
    tempNodeOptions = deepCopy(initNodeOptions);
    tempEdgeOptions = deepCopy(initEdgeOptions);
  }

  const applySettings = () => {
    nodeOptions.set(tempNodeOptions);
    edgeOptions.set(tempEdgeOptions);
    hideModal();
  };

  function beforeUnload(e) {
    nodeOptUnsubcribe();
    edgeOptUnsubcribe();
    e.preventDefault();
    e.returnValue = '...';
    return '...';
  }
</script>

<svelte:window on:beforeunload={beforeUnload}/>
<div
  id={$modals.settingModal}
  tabindex="-1"
  aria-hidden="true"
  class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0"
>
  <div class="relative max-h-full w-full max-w-3xl">
    <!-- Modal content -->
    <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
      <!-- Modal header -->
      <div
        class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
        id="setting-modal-tab"
        data-tabs-toggle="#setting-modal-content"
        role="tablist"
      >
        <ul class="flex flex-wrap flex-justify-between -mb-px">
          <li class="me-2">
            <a
              id="setting-tab"
              data-tabs-target="#setting"
              role="tab"
              arial-controls="setting"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >Settings</a
            >
          </li>
          <li class="me-2">
            <a
              id="system-tab"
              data-tabs-target="#system"
              role="tab"
              arial-controls="system"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              aria-current="page">System</a
            >
          </li>
          <li class="flex-grow">
            <!-- For button padding -->
          </li>
          <li class="me-4 mt-3">
            <button
              type="button"
              on:click={hideModal}
              class=" ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
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
      <div id="setting-modal-content">
        <!-- Setting content -->
        <div
          class="hidden dark:bg-gray-800"
          id="setting"
          role="tabpanel"
          aria-labelledby="setting-tab"
        >
          <SettingSidebar nodeOptions={tempNodeOptions} edgeOptions={tempEdgeOptions}/>
        </div>
        <!-- System content -->
        <div
          class="hidden dark:bg-gray-800"
          id="system"
          role="tabpanel"
          aria-labelledby="system-tab"
        >
          system
        </div>

      </div>

      <!-- Modal footer -->
      <div
        class="flex flex-wrap items-center space-x-2 rtl:space-x-reverse rounded-b border-t border-gray-200 p-6 dark:border-gray-600"
      >
        <button
          type="button"
          id="match-settings"
          class="rounded-lg px-2 py-1 text-center text-xs font-medium border-0 hover:text-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-800"
          on:click={resetOptions}
        >
          reset
        </button>
        <button
          type="button"
          id="match-settings"
          class="rounded-lg px-2 py-1 text-center text-xs font-medium border-0 hover:text-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:text-white dark:focus:ring-blue-800"
          on:click={matchOptions}
        >
          match
        </button>
        <div class="flex-grow">
          <!-- For button padding -->
        </div>
        <button
          type="button"
          id="apply-settings"
          class="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           on:click={applySettings} 
        >
          Apply
        </button>
        <button
          on:click={hideModal}
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
