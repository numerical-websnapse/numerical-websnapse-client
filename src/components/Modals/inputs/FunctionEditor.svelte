<script>
  import MathInput from "./MathInput.svelte";
  import * as validation from "../../../utils/validation";
  export let neuron;

  const functionCoef = (coefs) => {
    return $neuron.data.var_.map((var_, index) => {
      if (coefs[index]) {
        return coefs[index][0] === var_[0]
          ? coefs[index]
          : [var_[0], coefs[index][1]];
      }
      return [var_[0], '0'];
    });
  };

  $: $neuron.data.prf = $neuron.data.prf.map((prf) => [ prf[0], prf[1],
    functionCoef(prf[2]),
  ]);

  const addFunction = () => {
    $neuron.data.prf = [...$neuron.data.prf, ["f", null, []]];
  };

  const deleteFunction = (index) => {
    $neuron.data.prf = $neuron.data.prf.filter((item, i) => i !== index);
  };
</script>

<!-- Functions -->
<div class="flex flex-row mb-2 mt-6">
  <div class="me-4">
    <p class="block text-base font-medium text-gray-900 dark:text-white">
      Production Functions
    </p>
  </div>
  <div class="flex-grow">
    <!-- For button padding -->
  </div>
  <div class="me-4">
    <button
      type="button"
      on:click={() => addFunction()}
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
      <span class="sr-only">add functions</span>
    </button>
  </div>
</div>

<div
  class="grid grid-flow-row grid-col-1 space-y-3 max-h-60 overflow-y-auto rounded-lg pl-6 pr-2 py-2 border-solid border-2 border-slate-200 dark:border-slate-400"
>
  {#each $neuron.data.prf as [name, thld, coef], index}
    <!-- Function name -->
    <div class="flex flex-no-wrap overflow-x-auto space-x-6 pb-4">
      <div class="w-4 flex-none">
        <p
          class="block mt-8 px-0 text-sm font-medium text-gray-900 dark:text-white"
        >
          {index + 1}.
        </p>
      </div>
      <div class="flex-grow min-w-28 relative z-0 group">
        <MathInput
          id={"prf-name-" + index}
          label="Function name"
          error={validation.nameValidation(name, "Function", index)}
          bind:value={name}
        />
      </div>
      <!-- Threshold value -->
      <div class="flex-grow min-w-28 relative z-0 group">
        <MathInput
          id={"prf-thld-" + index}
          label="Threshold"
          error={validation.valueValidation(thld, "Threshold", index)}
          bind:value={thld}
        />
      </div>
      {#each coef as [varName, value], coef_index}
        <!-- Coefficients -->
        <div class="flex-grow min-w-28 relative z-0 group">
          <MathInput
            id={"coef-" + index + "-" + coef_index}
            label={varName}
            error={validation.valueValidation(value, "Coefficient", coef_index)}
            bind:value
          />
        </div>
      {/each}
      <!-- Delete button -->
      <div class="w-4 pt-6">
        <button
          type="button"
          on:click={() => deleteFunction(index)}
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
          <span class="sr-only">Delete Function</span>
        </button>
      </div>
    </div>
  {/each}
</div>
