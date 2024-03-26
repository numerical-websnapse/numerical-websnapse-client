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

  let matrixOn = false;
  let historyOn = false;
  let itemPerPage = 8;
  let page = 1;

  let searchTime = null;
  let start = null;
  let end = null;

  $: totalItems = $system.history.length;

  const nextPage = () => {
    page++;
  };

  const prevPage = () => {
    page--;
  };

  const selectPage = (e) => {
    page = parseInt(e.target.value);
  };

  $: {
    const currentPageValue = page;
    const totalItemsValue = totalItems;
    const totalPages = Math.ceil(totalItemsValue / itemPerPage);
    if (currentPageValue < 1) page = 1;
    if (currentPageValue > totalPages) page = totalPages;
    
    const time = parseInt(searchTime);

    if(typeof searchTime === "number" && time >= 0 && time < totalItems) {
      start = time;
      end = start + 1;
    }
    else {
      start = page ? (page - 1) * itemPerPage : 0;
      end = start + itemPerPage;
    }
  }
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
          <div class="space-y-6 p-6 overflow-x-auto overflow-y-auto">
            <!-- Table tools -->
            <div class="flex items-center">
              <!-- Disable history button -->
              <div class="flex-grow">
                <label class="inline-flex items-center me-5 cursor-pointer">
                  <input type="checkbox" bind:checked={historyOn} class="sr-only peer">
                  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable History</span>
                </label>
              </div>

              <!-- Search time-step -->
              <div class="relative">
                  <div class="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                      <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                  </div>
                  <input type="number" id="table-search" class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-56 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="time-step" bind:value={searchTime}>
              </div>
            </div>

            <!-- Table -->
            {#if $system.history.length === 0 || !historyOn}
              <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                {#if !historyOn}
                  History is disabled
                {:else}
                  No history available
                {/if}
              </div>
            {:else}
              <table
                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead
                  class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                  <tr>
                    <th scope="col" class="px-3 py-3"> Time </th>
                    <th scope="col" class="px-6 py-3"> Configuration </th>
                    <th scope="col" class="px-6 py-3"> Spike </th>
                    <th scope="col" class="px-6 py-3"> Output </th>
                  </tr>
                </thead>
                <tbody>
                  {#each $system.history.slice(start, end) as config, i}
                    <tr
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="text-sm font-medium">
                            {start + i}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium overflow-x-auto">
                          {@html getKatex(config.toString())}
                        </div>
                      </td>
                      {#if start + i === $system.history.length - 1}
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium"></div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium"></div>
                        </td>
                      {:else}
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium overflow-x-auto">
                            {@html getKatex($system.spike[start + i + 1].toString())}
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium overflow-x-auto">
                            {@html getKatex(
                              $system.environment[start + i + 1].toString()
                            )}
                          </div>
                        </td>
                      {/if}
                    </tr>
                  {/each}
                </tbody>
              </table>
              <nav
                class="flex items-center flex-column flex-wrap md:flex-row justify-between"
                aria-label="Table navigation"
              >
                <span
                  class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"
                  >Showing <span
                    class="font-semibold text-gray-900 dark:text-white"
                    >{start + 1}-{Math.min(end, totalItems)}</span
                  >
                  of
                  <span class="font-semibold text-gray-900 dark:text-white"
                    >{totalItems}</span
                  ></span
                >
                <ul
                  class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8"
                >
                  <li>
                    <button
                      on:click={prevPage}
                      class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >Previous</button
                    >
                  </li>
                  {#each Array.from({ length: Math.ceil(totalItems / itemPerPage) }, (_, i) => i + 1) as i}
                    {#if i < page + 3 && i > page - 3}
                      <li>
                        <button
                          on:click={selectPage}
                          value={i}
                          class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          >{i}</button
                        >
                      </li>
                    {/if}
                  {/each}
                  <li>
                    <button
                      on:click={nextPage}
                      class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >Next</button
                    >
                  </li>
                </ul>
              </nav>
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
            class="space-y-6 p-6 overflow-auto"
          >
            <div class="flex items-center">
              <!-- Disable matrix button -->
              <div class="flex-grow">
                <label class="inline-flex items-center me-5 cursor-pointer">
                  <input type="checkbox" bind:checked={matrixOn} class="sr-only peer">
                  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enable Matrices</span>
                </label>
              </div>
            </div>
            <div class="flex flex-col justify-center items-center space-y-6 dark:text-gray-400">
              {#if Object.keys($system.matrices).length && matrixOn}
                {#each Object.keys($system.matrices) as matrix, i}
                  {#if matrix === "error"}
                    <div class="text-center text-gray-500 dark:text-gray-400 py-4">
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
                    {#if $system.matrices[matrix].length > 20 || $system.matrices[matrix][0].length > 20}
                      <div class="text-center text-red-500 dark:text-red-400 py-4">
                        Matrix too large to display
                      </div>
                    {:else}
                      {@html getKatex(matrixFormatter($system.matrices[matrix]))}
                    {/if}
                  {/if}
                {/each}
              {:else}
                <div class="text-center text-gray-500 dark:text-gray-400 py-4">
                  {#if !matrixOn}
                    Matrices are disabled
                  {:else}
                    No matrices available
                  {/if}
                </div>
              {/if}
            </div>
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
