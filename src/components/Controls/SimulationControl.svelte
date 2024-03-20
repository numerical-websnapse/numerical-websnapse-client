<script>
  import { system } from "../../stores/system";
  import { graph } from "../../stores/graph";
  import { checkOpenModal } from "../../stores/modals";
  import SimulationRequest from  "../../api/api-handler.svelte";
  
  let simulator = null;
  $: maximum = $system.history.length - 1;
  $: $system.editing = $system.history.length ? false : true;

  const toggleGuided = () => {
    $system.guided = !$system.guided;
  };

  const preventFocus = (event) => {
    event.target.blur();
  };

  const initialRate = $system.tickRate;
  let speedMultiplier = 1.25;
  const handleSpeedChange = () => {
    $system.tickRate = initialRate * (1/speedMultiplier);
    const { edge } = $graph.getSpecification();
    $graph.updateSpecification({ edge });
  };

  const onKeydownControls = (e) => {
    if(checkOpenModal()) return;

    switch(e.code) {
      case 'KeyG':
        toggleGuided();
        break;
      case 'ArrowRight':
        simulator.nextConfig();
        break;
      case 'ArrowLeft':
        simulator.prevConfig();
        break;
      case 'Space':
        simulator.simulate();
        break;
      case 'KeyR':
        if (e.ctrlKey) simulator.resetSimulation();
        else simulator.resetConfig();
        break;
    }
  }
</script>

<svelte:window on:keydown={onKeydownControls} />
<SimulationRequest bind:this={simulator} />
<div
  class="fixed flex flex-col items-center bottom-[5vh] left-[50vw] translate-y-[5%] translate-x-[-50%]"
>
  <input
    id="sim-slider"
    type="range"
    min=0
    max={maximum}
    bind:value={$system.time}
    step=1
    class="sim-slider"
    on:focus={preventFocus}
    on:change={(e)=>simulator.jumpToConfig(e.target.valueAsNumber)}
    disabled={$system.simulating || $system.running ? true:false}
  />
  <div
    class="border-solid border-x border-b border-gray-300 rounded-b-lg bg-white px-4 pb-4 mt-[-1] shadow-lg"
  >
    <div class="flex flex-row items-center space-x-2 mt-2">
      <!-- Mode: guided || auto -->
      <button
        class="group rounded-md p-2 border-0 hover:bg-blue-800 dark:hover:bg-blue-700 {$system.guided
          ? 'bg-blue-800 dark:bg-blue-700'
          : ''}"
        on:click={toggleGuided}
        data-tooltip-target="tooltip-guided"
        data-tooltip-placement="top"
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
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 {$system.guided
            ? 'text-gray-100 dark:text-gray-100'
            : ''}"
        >
          <polyline points="16 3 21 3 21 8"></polyline>
          <line x1="4" y1="20" x2="21" y2="3"></line>
          <polyline points="21 16 21 21 16 21"></polyline>
          <line x1="15" y1="15" x2="21" y2="21"></line>
          <line x1="4" y1="4" x2="9" y2="9"></line>
        </svg>
      </button>
      <div
        id="tooltip-guided"
        role="tooltip"
        class="absolute invisible w-max z-[3] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        {#if $system.guided}
          Guided Mode (G)
        {:else}
          Pseudorandom Mode (G)
        {/if}
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Backtrack -->
      <button
        class="group rounded-md p-2 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        on:click={()=>simulator.prevConfig()}
        data-tooltip-target="tooltip-backtrack"
        data-tooltip-placement="top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
        >
          <polygon points="19 20 9 12 19 4 19 20"></polygon>
          <line x1="5" y1="19" x2="5" y2="5"></line>
        </svg>
      </button>
      <div
        id="tooltip-backtrack"
        role="tooltip"
        class="absolute invisible w-max z-[3] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Backtrack (←)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Play || Pause -->
      <button
        class="group rounded-full p-2 border-0 hover:bg-blue-800 dark:hover:bg-blue-700 {$system.simulating
          ? 'bg-blue-800 dark:bg-blue-700'
          : ''}"
        on:click={()=>simulator.simulate()}
        data-tooltip-target="tooltip-play"
        data-tooltip-placement="top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100 {$system.simulating
            ? 'text-gray-100 dark:text-gray-100'
            : ''}"
        >
          {#if $system.simulating}
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          {:else}
            <polygon points="7 3 21 12 7 21 7 3"></polygon>
          {/if}
        </svg>
      </button>
      <div
        id="tooltip-play"
        role="tooltip"
        class="absolute invisible w-max z-[3] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        {#if $system.simulating}
          Pause (Space)
        {:else}
          Play (Space)
        {/if}
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- Forward -->
      <button
        class="group rounded-md p-2 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        on:click={simulator.nextConfig}
        data-tooltip-target="tooltip-forward"
        data-tooltip-placement="top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="group-hover:text-gray-100 dark:text-gray-300 dark:group-hover:text-gray-100"
        >
          <polygon points="5 4 15 12 5 20 5 4"></polygon>
          <line x1="19" y1="5" x2="19" y2="19"></line>
        </svg>
      </button>
      <div
        id="tooltip-forward"
        role="tooltip"
        class="absolute invisible w-max z-[3] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Forward (→)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>

      <!-- reset -->
      <button
        class="group rounded-md p-2 border-0 hover:bg-blue-800 dark:hover:bg-blue-700"
        on:click={simulator.resetConfig}
        on:dblclick={simulator.resetSimulation}
        data-tooltip-target="tooltip-reset"
        data-tooltip-placement="top"
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
        >
          <polyline points="1 4 1 10 7 10"></polyline>
          <polyline points="23 20 23 14 17 14"></polyline>
          <path
            d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
          ></path>
        </svg>
      </button>
      <div
        id="tooltip-reset"
        role="tooltip"
        class="absolute invisible w-max z-[3] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
      >
        Reset (R)
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>

    <!-- Simulation speed -->
    <input
      id="minmax-range"
      type="range"
      min=0.25
      max=2.25
      step=0.125
      bind:value={speedMultiplier}
      class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      on:change={handleSpeedChange}
      data-tooltip-target="tooltip-speed"
      data-tooltip-placement="right"
    />
    <div
      id="tooltip-speed"
      role="tooltip"
      class="absolute invisible w-max z-[3] inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
    >
      Speed: &times;{speedMultiplier}
      <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
  </div>
</div>

<style lang="postcss">
  .sim-slider {
    @apply w-full h-2 top-0 rounded-none appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 z-[2]
      [&::-webkit-slider-thumb]:w-2.5
      [&::-webkit-slider-thumb]:h-2.5
      [&::-webkit-slider-thumb]:-mt-0.5
      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:bg-white
      [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:transition-all
      [&::-webkit-slider-thumb]:duration-150
      [&::-webkit-slider-thumb]:ease-in-out
      [&::-webkit-slider-thumb]:dark:bg-blue-200

      [&::-moz-range-thumb]:w-2.5
      [&::-moz-range-thumb]:h-2.5
      [&::-moz-range-thumb]:appearance-none
      [&::-moz-range-thumb]:bg-white
      [&::-moz-range-thumb]:border-4
      [&::-moz-range-thumb]:border-blue-600
      [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:transition-all
      [&::-moz-range-thumb]:duration-150
      [&::-moz-range-thumb]:ease-in-out;
  }
</style>
