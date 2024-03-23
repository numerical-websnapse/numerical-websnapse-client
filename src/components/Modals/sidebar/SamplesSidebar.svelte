<script>
  import { minimap } from "../../../graph/plugins/minimap";
  import { dataValidation } from "../../../utils/validation";
  import { getNotificationsContext } from "svelte-notifications";
  import { graph, setGraphLocalData } from "../../../stores/graph";
  import { resetSystem } from "../../../stores/system";

  import powers_of_n from "./samples/simple/powers-of-n.json";
  import natural_numbers from "./samples/simple/natural-numbers.json";
  import multiples_of_n from "./samples/simple/multiples-of-n.json";
  import non_deterministic from "./samples/simple/non-determinism.json";

  import subset_2_5 from "./samples/subsetsum/subset-2-5.json";
  import subset_3_10 from "./samples/subsetsum/subset-3-10.json";
  import subset_10_20 from "./samples/subsetsum/subset-10-20.json";
  import subset_15_80 from "./samples/subsetsum/subset-15-80.json";

  import add_module from "./samples/module/add-module.json";
  import sub_module from "./samples/module/sub-module.json";
  import fin_module from "./samples/module/fin-module.json";
  import input_module from "./samples/module/input-module.json";

  import adder_program from "./samples/program/adder-program.json";
  import generator_program from "./samples/program/generator-program.json";
  import subtractor_program from "./samples/program/subtractor-program.json";
  import move_program from "./samples/program/move-program.json";
  import copy_program from "./samples/program/copy-program.json";

  const { addNotification } = getNotificationsContext();

  const simple = [
    {
      name: "Powers of N",
      data: powers_of_n,
    },
    {
      name: "Natural Numbers",
      data: natural_numbers,
    },
    {
      name: "Multiples of N",
      data: multiples_of_n,
    },
    {
      name: "Non-Deterministic",
      data: non_deterministic,
    },
  ]

  const subsetsum = [
    {
      name: "Size (|V|) = 2; Sum (S) = 5",
      data: subset_2_5,
    },
    {
      name: "Size (|V|) = 3; Sum (S) = 10",
      data: subset_3_10,
    },
    {
      name: "Size (|V|) = 10; Sum (S) = 20",
      data: subset_10_20,
    },
    {
      name: "Size (|V|) = 15; Sum (S) = 80",
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

  const programs = [
    {
      name: "Adder Program",
      data: adder_program,
    },
    
    {
      name: "Subtractor Program",
      data: subtractor_program,
    },
    {
      name: "Generator Program",
      data: generator_program,
    },
    {
      name: "Move Program",
      data: move_program,
    },
    {
      name: "Copy Program",
      data: copy_program,
    },
  ];

  const changeGraphData = (data) => {
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
        id="simple-system-tab"
        data-tabs-target="#simple-system"
        role="tab"
        arial-controls="simple-system"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Simple Systems</button
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
        id="instruction-modules-tab"
        data-tabs-target="#instruction-modules"
        role="tab"
        arial-controls="instruction-modules"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Instruction Modules</button
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
    <!-- Simple Systems -->
    <div
      class="hidden dark:bg-gray-800"
      id="simple-system"
      role="tabpanel"
      aria-labelledby="simple-system-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Simple Systems
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each simple as item}
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

    <!-- Instruction Modules -->
    <div
      class="hidden dark:bg-gray-800"
      id="instruction-modules"
      role="tabpanel"
      aria-labelledby="instruction-modules-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Register Machine Intruction Modules
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

    <!-- Register Machines -->
    <div
      class="hidden dark:bg-gray-800"
      id="register-machine"
      role="tabpanel"
      aria-labelledby="register-machine-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Register Machine Programs
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each programs as item}
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