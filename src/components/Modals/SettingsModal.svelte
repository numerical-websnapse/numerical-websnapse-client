<script>
  import SettingSidebar from "./sidebar/SettingSidebar.svelte";
  import SamplesSidebar from "./sidebar/SamplesSidebar.svelte";

  import { onDestroy } from "svelte";
  import { graph } from "../../stores/graph";
  import { ExtGraph } from "../../graph/render";
  import { modals, getModal } from "../../stores/modals";
  import {
    dark,
    nodeOptions,
    edgeOptions,
    graphOptions,
    nodeMetaData,
    edgeMetaData,
    applyTheme,
  } from "../../stores/settings";
  import { nodeState, edgeState } from "../../graph/config";
  import { deepCopy } from "../../utils/copy";

  /*G6 has a bug where item specifications are replaced with its item states specification
  - We need to remove the "states" from the specification to prevent this
  See patches for fix*/
  const nodeOptUnsubcribe = nodeOptions.subscribe((value) => {
    if ($graph instanceof ExtGraph) {
      const spec = $graph.getSpecification();
      delete spec.nodeState;
      delete spec.edgeState;
      $graph.updateSpecification(spec);
      $graph.updateStateConfig("node", nodeState());
    }
  });

  const edgeOptUnsubcribe = edgeOptions.subscribe((value) => {
    if ($graph instanceof ExtGraph) {
      const spec = $graph.getSpecification();
      delete spec.nodeState;
      delete spec.edgeState;
      $graph.updateSpecification(spec);
      $graph.updateStateConfig("edge", edgeState());
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
  };

  const resetOptions = () => {
    tempNodeOptions = deepCopy(initNodeOptions);
    tempEdgeOptions = deepCopy(initEdgeOptions);
  };

  const applySettings = () => {
    nodeOptions.set(tempNodeOptions);
    edgeOptions.set(tempEdgeOptions);
    hideModal();
  };

  const changeGraphTheme = (theme) => {
    $graph.updateTheme($graphOptions.themes[theme]);
    $graph.updatePlugin($graphOptions.grids[theme]);
    applyTheme(theme);
  }

  const toggleTheme = () => {
    if (localStorage.theme === 'dark') {
      localStorage.theme = 'light'
      document.documentElement.classList.remove('dark')
    } else {
      localStorage.theme = 'dark'
      document.documentElement.classList.add('dark')
    }
    changeGraphTheme(localStorage.theme);
  };

  if ($dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
</script>

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
              id="samples-tab"
              data-tabs-target="#samples"
              role="tab"
              arial-controls="samples"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              aria-current="page">Samples</a
            >
          </li>
          <li class="flex-grow">
            <!-- For button padding -->
          </li>
          <li class="me-4 mt-3">
            <button
              type="button"
              on:click={toggleTheme}
              class=" ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
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
                {#if $dark}
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                {:else}
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                {/if}
              </svg>
              <span class="sr-only">Theme</span>
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
          <SettingSidebar
            nodeOptions={tempNodeOptions}
            edgeOptions={tempEdgeOptions}
            {nodeMetaData}
            {edgeMetaData}
          />
        </div>
        <!-- samples content -->
        <div
          class="hidden dark:bg-gray-800"
          id="samples"
          role="tabpanel"
          aria-labelledby="samples-tab"
        >
          <SamplesSidebar />
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
          Exit
        </button>
      </div>
    </div>
  </div>
</div>
