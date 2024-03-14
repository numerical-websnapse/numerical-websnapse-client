<script>
  import MathInput from "./MathInput.svelte";
  import * as validation from "../../../utils/validation";
  export let neuron;

  const addVariable = () => {
      $neuron.data.var_ = [...$neuron.data.var_, ['', 0]];
  }

  const deleteVariable = (index) => {
      $neuron.data.var_ = $neuron.data.var_.filter((item, i) => i !== index);
      $neuron.data.prf = $neuron.data.prf.map((prf) => [ prf[0], prf[1],
        prf[2].filter((item, i) => i !== index),
      ]);
  }
</script>

<div class="flex flex-row mb-2">
  <div class="me-4">
    <p class="block text-base font-medium text-gray-900 dark:text-white">
      Variables
    </p>
  </div>
  <div class="flex-grow">
    <!-- For button padding -->
  </div>
  <div class="me-4">
    <button
      type="button"
      on:click={() => addVariable()}
      class=" ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
    >
      <svg
        class="h-3 w-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <line
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          x1="7"
          y1="0"
          x2="7"
          y2="14"
        />
        <line
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          x1="0"
          y1="7"
          x2="14"
          y2="7"
        />
      </svg>
      <span class="sr-only">add variables</span>
    </button>
  </div>
</div>

<div
  class="flex flex-col space-y-3 max-h-60 overflow-y-auto flex-grow rounded-lg px-6 py-2 border-solid border-2 border-slate-200 dark:border-slate-400"
>
  {#each $neuron.data.var_ as [name, value], index}
    <!-- Variable name -->
    <div class="flex flex-row space-x-6 flex-grow">
      <div class="w-4">
        <p
          class="block mt-8 px-0 text-sm font-medium text-gray-900 dark:text-white"
        >
          {index + 1}.
        </p>
      </div>
      <div class="flex-grow relative z-0 group">
        <MathInput
          id={"var-name-" + index}
          label="Variable name"
          error={ validation.nameValidation(name,'Variable',index) }
          bind:value={name}
        />
      </div>
      <!-- Variable value -->
      <div class="basis-6/12 relative z-0 group">
        <MathInput
          id={"var-value-" + index}
          label="Variable value"
          error={ validation.valueValidation(value,'Variable',index) }
          bind:value
        />
      </div>
      <!-- Delete button -->
      {#if $neuron.data.var_.length !== 1}
        <div class="w-4 pt-6">
          <button
            type="button"
            on:click={() => deleteVariable(index)}
            class=" ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <line
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                x1="0"
                y1="7"
                x2="14"
                y2="7"
              />
            </svg>
            <span class="sr-only">delete variables</span>
          </button>
        </div>
      {/if}
    </div>
  {/each}
</div>
