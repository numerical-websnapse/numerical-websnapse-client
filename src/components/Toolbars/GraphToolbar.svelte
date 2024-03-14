<script>
  import LayoutDropdown from "./dropdown/LayoutDropdown.svelte";
  import { graph } from "../../stores/graph";
  import { getModal } from "../../stores/modals";

  const zoomSensitivity = 50;
  const minZoom = 0.00001;
  const maxZoom = 1000;

  const zoomOut = () => {
    const zoomRatio = 100 / (100 + zoomSensitivity);
    if (zoomRatio !== 1) {
      $graph.zoom(zoomRatio, undefined, {});
    }
  };

  const zoomIn = () => {
    const zoomRatio = (100 + zoomSensitivity) / 100;
    if (zoomRatio !== 1) {
      $graph.zoom(zoomRatio, undefined, {});
    }
  };

  const autoZoom = () => {
    $graph.fitView(undefined, {});
  };

  const openSettings = () => {
    getModal('settingModal').show();
  };

  const openHistory = () => {
    getModal('historyModal').show();
  }

  const onKeydownGraph = (e) => {
    switch (e.code) {
      case "Equal":
        zoomIn();
        break;
      case "Minus":
        zoomOut();
        break;
      case "Digit0":
        autoZoom();
        break;
      case "KeyH":
        openHistory();
        break;
      case 'Escape':
        getModal('settingModal').toggle();
        break;
    }

  };
</script>

<svelte:window on:keydown={onKeydownGraph} />

<div class="fixed top-[2.5vh] right-[2.5vw]">
  <div class="flex flex-row">
    <div
      class="flex flex-row flex-wrap items-center justify-between mr-2 my-auto space-x-2 rounded-lg border-solid border border-gray-500 bg-gray-100 dark:bg-gray-900"
    >
      <!-- History -->
      <button
        on:click={openHistory}
        data-tooltip-target="tooltip-history"
        data-tooltip-placement="bottom"
        class="group rounded-md p-2 bg-gray-100 dark:bg-gray-800 border-0 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-800 active:bg-blue-800 dark:hover:bg-blue-800 dark:active:ring-blue-800"
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
        <path class="cls-1" d="M12.9,22.34a9.66,9.66,0,1,0-9.65-9.75" transform="translate(-0.11 -2.28)"/><polyline class="cls-1" points="0.75 7.97 2.82 10.68 5.52 8.61"/><polyline class="cls-1" points="12.49 4.9 12.49 11.59 15.53 13.92"/>
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
    <!-- Graph action toolbar -->
    <div
      class="flex flex-row flex-wrap items-center justify-between my-auto space-x-2 rounded-lg border-solid border border-gray-500 bg-gray-100 dark:bg-gray-900"
    >
      <!-- Zoom in -->
      <button
        on:click={zoomIn}
        data-tooltip-target="tooltip-zoom-in"
        data-tooltip-placement="bottom"
        class="group rounded-md p-2 bg-gray-100 dark:bg-gray-800 border-0 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-800 active:bg-blue-800 dark:hover:bg-blue-800 dark:active:ring-blue-800"
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
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
      <div
        id="tooltip-zoom-in"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Zoom In (+)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Zoom out -->
      <button
        on:click={zoomOut}
        data-tooltip-target="tooltip-zoom-out"
        data-tooltip-placement="bottom"
        class="group rounded-md p-2 bg-gray-100 dark:bg-gray-800 border-0 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-800 active:bg-blue-800 dark:hover:bg-blue-700 dark:active:ring-blue-800"
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
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </button>
      <div
        id="tooltip-zoom-out"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Zoom Out (-)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Fit View -->
      <button
        on:click={autoZoom}
        data-tooltip-target="tooltip-auto-zoom"
        data-tooltip-placement="bottom"
        class="group rounded-md p-2 bg-gray-100 dark:bg-gray-800 border-0 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-800 active:bg-blue-800 dark:hover:bg-blue-700 dark:active:ring-blue-800"
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
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
          ><polyline class="st0" points="7.7,2.2 7.7,7.8 2.3,7.8 " />
          <polyline class="st0" points="16.3,2.2 16.3,7.8 21.7,7.8 " />
          <polyline class="st0" points="7.7,21.8 7.7,16.2 2.3,16.2 " />
          <polyline class="st0" points="16.3,21.8 16.3,16.2 21.7,16.2 " />
          <circle class="st1" cx="12" cy="12" r="2" /></svg
        >
      </button>
      <div
        id="tooltip-auto-zoom"
        role="tooltip"
        class="absolute invisible w-max inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Auto Zoom (0)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Auto Layout -->
      <button
        id="layoutDropdownButton"
        data-dropdown-toggle="layoutDropdown"
        class="group rounded-md p-2 bg-gray-100 dark:bg-gray-800 border-0 hover:bg-blue-800 active:ring-4 active:outline-none active:ring-blue-800 active:bg-blue-800 dark:hover:bg-blue-700 dark:active:ring-blue-800"
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
          class="group-hover:text-gray-100 group-active:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 dark:group-active:text-gray-100"
          ><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line></svg
        >
      </button>

      <LayoutDropdown id="layoutDropdown" graph={graph} />
    </div>

    <!-- Single-use toolbar -->
    <div
      class="flex flex-row flex-wrap items-center justify-between my-auto ml-2 space-x-1 rounded-lg border-solid border border-gray-500 bg-gray-100 dark:bg-gray-900"
    >
      <!-- Settings -->
      <button
        on:click={openSettings}
        class="group rounded-md p-2 bg-gray-100 dark:bg-gray-800 border-0 hover:bg-gray-800 active:ring-4 active:outline-none active:ring-gray-800 active:bg-gray-800 dark:hover:bg-gray-700 dark:active:ring-gray-800"
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
          <circle cx="12" cy="12" r="3"></circle>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          ></path><path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<style lang="postcss">
</style>
