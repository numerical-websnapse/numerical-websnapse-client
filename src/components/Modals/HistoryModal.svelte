<script>
  import { matrixFormatter } from "../../utils/math";
  import { modals, getModal } from "../../stores/modals";
  import { system } from "../../stores/system";

  const katex = window.katex;

  const getKatex = (text) => {
    return katex.renderToString(String(text), {
      throwOnError: false,
      output: "mathml",
    });
  };

  const hideModal = () => {
    getModal("historyModal").hide();
  };
</script>

<!-- Main modal -->
<div
  id={$modals.historyModal}
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
        id="history-modal-tab"
        data-tabs-toggle="#history-modal-content"
        role="tablist"
      >
        <ul class="flex flex-wrap flex-justify-between -mb-px">
          <li class="me-2">
            <a
              id="history-tab"
              data-tabs-target="#history"
              role="tab"
              arial-controls="history"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >History</a
            >
          </li>
          <li class="me-2">
            <a
              id="matrix-tab"
              data-tabs-target="#matrix"
              role="tab"
              arial-controls="matrix"
              arial-selected="false"
              class="inline-block p-4 border-b-2 rounded-t-lg hover:no-underline capitalize select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              >Matrices</a
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
      <div id="history-modal-content">
        <!-- History content -->
        <div
          class="hidden dark:bg-gray-800"
          id="history"
          role="tabpanel"
          aria-labelledby="history-tab"
        >
          <div class="space-y-6 p-6 overflow-auto">
            {#if $system.history.length === 0}
              <div class="text-center text-gray-500 dark:text-gray-400">
                No history available
              </div>
            {:else}
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-6 py-3"> Time </th>
                    <th scope="col" class="px-6 py-3"> Configuration </th>
                    <th scope="col" class="px-6 py-3"> Spike </th>
                    <th scope="col" class="px-6 py-3"> Output </th>
                    <th scope="col" class="px-6 py-3"> Next Configuration </th>
                  </tr>
                </thead>
                <tbody>
                  {#each $system.history as config, i}
                    <tr
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="text-sm font-medium">
                            {i + 1}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="text-sm font-medium">
                            {@html getKatex(config.toString())}
                          </div>
                        </div>
                      </td>
                      {#if i === $system.history.length - 1}
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium"></div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium"></div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium"></div>
                        </td>
                      {:else}
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium">
                            {@html getKatex($system.spike[i + 1].toString())}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium">
                            {@html getKatex(
                              $system.environment[i + 1].toString()
                            )}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium">
                            {@html getKatex($system.history[i + 1].toString())}
                          </div>
                        </td>
                      {/if}
                    </tr>
                  {/each}
                </tbody>
              </table>
            {/if}
          </div>
        </div>

        <!-- Matrix content -->
        <div
          class="hidden dark:bg-gray-800"
          id="matrix"
          role="tabpanel"
          aria-labelledby="matrix-tab"
        >
          <div
            class="flex flex-col items-center justify-center space-y-6 p-6 overflow-auto"
          >
            {#if Object.keys($system.matrices).length}
              {#each Object.keys($system.matrices) as matrix, i}
                {#if matrix === "error"}
                  <div class="text-center text-gray-500 dark:text-gray-400">
                    No matrices for the current configuration
                  </div>
                {:else}
                  <div>
                    {#if matrix === "P"}
                      Production Matrix
                    {:else if matrix === "V"}
                      Variable matrix
                    {:else if matrix === "E"}
                      Environment matrix
                    {/if}
                  </div>
                  {@html getKatex(matrixFormatter($system.matrices[matrix]))}
                {/if}
              {/each}
            {:else}
              <div class="text-center text-gray-500 dark:text-gray-400">
                No matrices available
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
          on:click={() => hideModal()}
          type="button"
          class="{$modals.guided
            .cancelButton} rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
