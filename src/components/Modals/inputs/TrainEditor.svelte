<script>
  import * as validation from "../../../utils/validation";
  export let neuron;

  let train = $neuron.data.train.join(',');

  const handleTrainInput = () => {
    const values = train.split(',');
    $neuron.data.train = values.map((value) => {
      return value.trim();
    });
  };

$: valid = validation.trainValidation(train) ? false : true;
$: errorClassInput = !valid ? 'border-red-500 dark:border-red-500' : '';
$: errorClassLabel = !valid ? 'text-red-500 dark:text-red-500' : '';
</script>

<div class="flex flex-row mb-2">
  <div class="me-4">
    <p class="block text-base font-medium text-gray-900 dark:text-white">
      Spike Train
    </p>
  </div>
</div>

<div
  class="flex flex-col space-y-3 max-h-60 overflow-y-auto flex-grow rounded-lg px-6 py-2 border-solid border-2 border-slate-200 dark:border-slate-400"
>
  <input
    type="text"
    id={"train-" + $neuron.data.id}
    class="block px-0 pt-8 w-full h-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer {errorClassInput}"
    placeholder=""
    bind:value={train}
    required="true"
    on:change={handleTrainInput}
  />
  <label
    for={"train-" + $neuron.data.id}
    class="peer-focus:font-medium pt-6 absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 {errorClassLabel}"
    >Spike Train</label
  >
</div>
