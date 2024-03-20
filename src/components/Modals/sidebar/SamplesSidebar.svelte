<script>
  import { minimap } from "../../../graph/plugins/minimap";
  import { dataValidation } from "../../../utils/validation";
  import { getNotificationsContext } from "svelte-notifications";
  import { graph, setGraphLocalData } from "../../../stores/graph";
  import { resetSystem } from "../../../stores/system";

  import subset_2_5 from "./samples/subset-2-5.json";
  import subset_3_10 from "./samples/subset-3-10.json";
  import subset_10_20 from "./samples/subset-10-20.json";
  import subset_15_80 from "./samples/subset-15-80.json";

  import add_module from "./samples/add-module.json";
  import sub_module from "./samples/sub-module.json";
  import fin_module from "./samples/fin-module.json";
  import input_module from "./samples/input-module.json";

  const { addNotification } = getNotificationsContext();

  const subsetsum = [
    {
      name: "Subset Sum 2-5",
      data: subset_2_5,
    },
    {
      name: "Subset Sum 3-10",
      data: subset_3_10,
    },
    {
      name: "Subset Sum 10-20",
      data: subset_10_20,
    },
    {
      name: "Subset Sum 15-80",
      data: subset_15_80,
    },
  ];

  const modules = [
    {
      name: "Add Module",
      data: add_module,
    },
    {
      name: "Sub Module",
      data: sub_module,
    },
    {
      name: "Fin Module",
      data: fin_module,
    },
    {
      name: "Input Module",
      data: input_module,
    },
  ];

  const changeGraphData = (data) => {
    console.log(data);
    const errors = dataValidation(data);

    if (errors.length) {
      addNotification({
        position: "top-left",
        messages: errors,
        type: "error",
        header: "Failed to upload:",
        removeAfter: 4000,
      });
      return;
    }

    $graph.changeData(data, "replace");
    $graph.updatePlugin(minimap());
    setGraphLocalData();
    resetSystem();
  };
</script>

<div class="flex flex-row">
  <!-- Sidebar -->
  <div
    class="text-sm font-medium text-center text-gray-500 border-r border-gray-200 dark:text-gray-400 dark:border-gray-700"
    id="samples-side-tab"
    data-tabs-toggle="#samples-side-content"
    role="tablist"
  >
    <div
      class="flex flex-col flex-wrap py-2 px-2 h-full content-center space-y-2 max-h-[45vh] md:max-h-[60vh]"
    >
      <button
        id="subset-sum-tab"
        data-tabs-target="#subset-sum"
        role="tab"
        arial-controls="subset-sum"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Subset Sum</button
      >
      <button
        id="register-machine-tab"
        data-tabs-target="#register-machine"
        role="tab"
        arial-controls="register-machine"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Register Machine</button
      >
    </div>
  </div>
  <!-- Contents -->
  <div id="samples-side-content" class="flex-grow">
    <!-- Subset Sum Systems -->
    <div
      class="hidden dark:bg-gray-800"
      id="subset-sum"
      role="tabpanel"
      aria-labelledby="subset-sum-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Subset Sum Systems
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each subsetsum as item}
            <button
              on:click={() => changeGraphData(item.data)}
              class="text-gray-500 border-0 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >{item.name}</button
            >
          {/each}
        </div>
      </div>
    </div>

    <!-- Subset Sum Systems -->
    <div
      class="hidden dark:bg-gray-800"
      id="subset-sum"
      role="tabpanel"
      aria-labelledby="subset-sum-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Subset Sum Systems
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each subsetsum as item}
            <button
              on:click={() => changeGraphData(item.data)}
              class="text-gray-500 border-0 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >{item.name}</button
            >
          {/each}
        </div>
      </div>
    </div>

    <!-- Register Machine Systems -->
    <div
      class="hidden dark:bg-gray-800"
      id="register-machine"
      role="tabpanel"
      aria-labelledby="register-machine-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Register Machine Intructions
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each modules as item}
            <button
              on:click={() => changeGraphData(item.data)}
              class="text-gray-500 border-0 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >{item.name}</button
            >
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
