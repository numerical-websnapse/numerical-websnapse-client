<script>
  import VariableEditor from "./inputs/VariableEditor.svelte";
  import FunctionEditor from "./inputs/FunctionEditor.svelte";
  import TrainEditor from "./inputs/TrainEditor.svelte";

  import { onDestroy } from "svelte";
  import { nodeValidation } from "../../utils/validation";
  import { modals, getModal } from "../../stores/modals";
  import { neuron, resetNeuron } from "../../stores/graph";
  import { addNode, updateNode } from "../../graph/actions/node-action";
  import { getNotificationsContext } from "svelte-notifications";

  const { addNotification } = getNotificationsContext();

  const unsubscribe = neuron.subscribe(()=>{});

  onDestroy(async () => {
    unsubscribe();
  });

  const hideModal = () => {
    getModal('nodeModal').hide();
  }

  let errors = [];
  const handleSubmit = () => {
    errors = nodeValidation($neuron);

    if (errors.length) {
      addNotification({
        position: 'top-left',
        messages: errors,
        type: 'error',
        header: 'Ensure that these requirements are met:',
        removeAfter: 4000,
      });
      return;
    }

    if ($modals.neuronAction === 'create') {
      addNode($neuron);
      addNotification({
        position: 'top-left',
        messages: ['Successfully created node'],
        type: 'success',
        removeAfter: 4000,
      });
    }

    else if ($modals.neuronAction === 'edit') {
      updateNode($neuron.id, $neuron);
      addNotification({
        position: 'top-left',
        messages: ['Successfully edited node'],
        type: 'success',
        removeAfter: 4000,
      });
    }

    resetNeuron();
    hideModal();
  }
</script>
<!-- Main modal -->
<div
  id={ $modals.nodeModal }
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
        id="node-modal-tab"
        data-tabs-toggle="#node-modal-content"
        role="tablist"
      >
        <ul class="flex flex-wrap flex-justify-between -mb-px">
          <li class="me-2">
            <a
              id="node-tab"
              data-tabs-target="#node"
              role="tab"
              arial-controls="node"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >{$modals.neuronAction} Node</a
            >
          </li>
          <li class="me-2">
            <a
              id="preview-tab"
              data-tabs-target="#preview"
              role="tab"
              arial-controls="preview"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              aria-current="page">Preview</a
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
      <div id="node-modal-content">
        <!-- Node action content -->
        <div
          class="hidden dark:bg-gray-800"
          id="node"
          role="tabpanel"
          aria-labelledby="node-tab"
        >
          <div class="space-y-6 p-6">
            <!-- Input form -->
            <form class="max-w-full mx-auto" id="node-form" on:submit|preventDefault={handleSubmit}>
              <!-- Row 1 -->
              <div class="flex flex-row space-x-4">
                <!-- Node label -->
                <div class="basis-3/4">
                  <div class="mb-5">
                    <label
                      for="label"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >Label</label
                    >
                    <input
                      type="text"
                      id="label"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="n1"
                      bind:value={ $neuron.data.label }
                      required
                    />
                  </div>
                </div>
                <!-- Node type -->
                <div class="basis-1/4 mr-5">
                  <label
                    for="type"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Type</label
                  >
                  <select
                    id="type"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    bind:value={ $neuron.data.type }
                  >
                    <option value="reg">regular</option>
                    <option value="out">output</option>
                    <option value="in">input</option>
                  </select>
                </div>
              </div>
              <!-- Row 2 -->
              {#if $neuron.data.type === 'reg'}
                <VariableEditor neuron={neuron}/>
                <FunctionEditor neuron={neuron}/>
              {:else if $neuron.data.type === 'in'}
                <TrainEditor neuron={neuron}/>
              {/if}
            </form>
          </div>
        </div>

        <!-- Preview content -->
        <div
          class="hidden p-4 bg-gray-50 dark:bg-gray-800"
          id="preview"
          role="tabpanel"
          aria-labelledby="preview-tab"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            This is some placeholder content for the <strong
              class="font-medium text-gray-800 dark:text-white"
              >Preview tab</strong
            >. Clicking another tab will toggle the visibility of this one for
            the next. The tab JavaScript swaps classes to control the content
            visibility and styling.
          </p>
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
          id="submit-node"
          class="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           on:click={()=>handleSubmit()} 
        >
          Submit
        </button>
        <button
          on:click={()=>hideModal()}
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
