<script>
  import { onMount, onDestroy } from "svelte";
  import { MathToSvgElement } from "../../../utils/math";
  import { modals } from "../../../stores/modals";
  import { system } from "../../../stores/system";

  export let id;
  export let prfs;
  export let counter;

  let selection = prfs.map((prf) => {
    return {
      index: counter(),
      label: MathToSvgElement(prf[0]),
    };
  });

  const findSelected = () => {
    return selection.find((s) => $system.choice.spike[s.index]) || null;
  };

  const changeSelected = (e) => {
    let target = e.target.closest("button");

    selection.forEach((element) => {
      if (element.index == target.value) {
        $system.choice.spike[element.index] = 1;
      } else {
        $system.choice.spike[element.index] = 0;
      }
    });
    selected = findSelected();
  };

  const toggleDropdown = (e) => {
    let target = e.target.closest("button");

    const dropdown = document.getElementById(target.dataset.dropdownToggle);
    dropdown.classList.toggle("hidden");
  };

  const modalDeselect = (e) => {
    if (e.target.id == $modals.guided.cancelButton) return;
    if (e.target.id == $modals.guided.submitButton) return;

    const isWithinButton = e.target.closest("button");
    let sameDropdownButtonId = null;

    if (isWithinButton) {
      sameDropdownButtonId = isWithinButton.id === dropdownId + "-button";
    }

    if (!sameDropdownButtonId && e.target.id !== dropdownId) {
      const dropdown = document.getElementById(dropdownId);
      dropdown.classList.add("hidden");
    }
  };

  let selected = findSelected();
  const modal = document.getElementById($modals.guidedModal);
  const dropdownId = "function-select-" + id + "-dropdown";

  onMount(async () => {
    modal.addEventListener("click", modalDeselect);
  });

  onDestroy(async () => {
    modal.removeEventListener("click", modalDeselect);
  });
</script>

<button
  id={dropdownId + "-button"}
  data-dropdown-toggle={dropdownId}
  type="button"
  disabled={$system.choice.random[id]}
  class="w-full flex flex-row items-center rounded-lg h-9 border border-gray-300 dark:border-gray-500 p-2 text-gray-900 dark:text-white"
  on:click={toggleDropdown}
>
  {#if selected}
    {@html selected.label}
  {:else}
    <span class="text-red-400 text-sm">nothing to select</span>
  {/if}
  <div class="flex-grow"></div>
  <svg
    class="w-2.5 h-2.5 ms-3"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>
</button>

<div
    id={dropdownId}
    class="absolute hidden w-full bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
  >
    <div class="flex flex-col gap-0 overflow-y-auto max-h-15">
      {#each selection as s}
        <button
          class="w-full p-2 h-9 items-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white {!$system
            .choice.active[s.index]
            ? ''
            : 'hover:bg-gray-300 dark:hover:bg-gray-400'} {selected &&
          s.index == selected.index
            ? 'border-2 border-black dark:border-blue-500'
            : ''}"
          value={s.index}
          disabled={!$system.choice.active[s.index]}
          on:click={changeSelected}
        >
          {@html s.label}
        </button>
      {/each}
    </div>
  </div>
