<script>
  import { minimap } from "../../../graph/plugins/minimap";
  import { dataValidation } from "../../../utils/validation";
  import { getNotificationsContext } from "svelte-notifications";
  import { graph, setGraphLocalData } from "../../../stores/graph";
  import { system, resetSystem } from "../../../stores/system";
  // Simple Systems
  import powers_of_n from "./samples/simple/powers-of-n.json";
  import natural_numbers from "./samples/simple/natural-numbers.json";
  import multiples_of_n from "./samples/simple/multiples-of-n.json";
  import non_deterministic from "./samples/simple/non-determinism.json";
  import sample_from_ballesteros from "./samples/simple/sample-from-ballesteros.json";
  import sample_from_wu from "./samples/simple/sample-from-wu.json";
  // Subset Sum
  import subset_2_5 from "./samples/subsetsum/subset-2-5.json";
  import subset_3_10 from "./samples/subsetsum/subset-3-10.json";
  import subset_10_20 from "./samples/subsetsum/subset-10-20.json";
  import subset_15_80 from "./samples/subsetsum/subset-15-80.json";
  // Instruction Modules
  import add_module from "./samples/module/add-module.json";
  import sub_module from "./samples/module/sub-module.json";
  import fin_module from "./samples/module/fin-module.json";
  import input_module from "./samples/module/input-module.json";
  // Logic Gates
  import and_gate from "./samples/logic-gate/and-gate.json";
  import or_gate from "./samples/logic-gate/or-gate.json";
  import not_gate from "./samples/logic-gate/not-gate.json";
  import convert_to_boolean from "./samples/logic-gate/convert-to-boolean.json";
  // Register Machine Programs
  import adder_program from "./samples/program/adder-program.json";
  import generator_program from "./samples/program/generator-program.json";
  import subtractor_program from "./samples/program/subtractor-program.json";
  import clear_program from "./samples/program/clear-program.json";
  import move_program from "./samples/program/move-program.json";
  import copy_program from "./samples/program/copy-program.json";
  // Stress Tests - Chain
  import all_chain_250_loop from "./samples/stress-test/chain/all-chain-250-loop.json";
  import all_chain_250 from "./samples/stress-test/chain/all-chain-250.json";
  import one_chain_250_loop from "./samples/stress-test/chain/one-chain-250-loop.json";
  import one_chain_250 from "./samples/stress-test/chain/one-chain-250.json";
  // Stress Tests - Complete Graph
  import complete_10 from "./samples/stress-test/complete/complete-10.json";
  import complete_20 from "./samples/stress-test/complete/complete-20.json";
  import complete_30 from "./samples/stress-test/complete/complete-30.json";
  import complete_40 from "./samples/stress-test/complete/complete-40.json";
  // Stress Tests - Larger Subset Sum
  import subset_25_100 from "./samples/stress-test/subsetsum/subset-25-100.json";
  import subset_50_200 from "./samples/stress-test/subsetsum/subset-50-200.json";
  import subset_75_300 from "./samples/stress-test/subsetsum/subset-75-300.json";
  import subset_100_400 from "./samples/stress-test/subsetsum/subset-100-400.json";

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
    {
      name: "Sample from Ballesteros et al.",
      data: sample_from_ballesteros,
      link: "https://link.springer.com/article/10.1007/s41965-022-00093-7",
    },
    {
      name: "Sample from Wu et al.",
      data: sample_from_wu,
      link: "https://ieeexplore.ieee.org/document/9138473",
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

  const gates = [
    {
      name: "AND Gate",
      data: and_gate,
    },
    {
      name: "OR Gate",
      data: or_gate,
    },
    {
      name: "NOT Gate",
      data: not_gate,
    },
    {
      name: "Convert to Boolean",
      data: convert_to_boolean,
    },
  ]

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
      name: "Clear Program",
      data: clear_program,
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

  const stressTests = [
    {
      name: "All Chain 250 Loop",
      data: all_chain_250_loop,
    },
    {
      name: "All Chain 250",
      data: all_chain_250,
    },
    {
      name: "One Chain 250 Loop",
      data: one_chain_250_loop,
    },
    {
      name: "One Chain 250",
      data: one_chain_250,
    },
    {
      name: "Complete 10",
      data: complete_10,
    },
    {
      name: "Complete 20",
      data: complete_20,
    },
    {
      name: "Complete 30",
      data: complete_30,
    },
    {
      name: "Complete 40",
      data: complete_40,
    },
    {
      name: "Subset 25 100",
      data: subset_25_100,
    },
    {
      name: "Subset 50 200",
      data: subset_50_200,
    },
    {
      name: "Subset 75 300",
      data: subset_75_300,
    },
    {
      name: "Subset 100 400",
      data: subset_100_400,
    },
  ]

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
    $graph.updatePlugin(minimap(
      $graph.getAllEdgesData().length
    ));
    setGraphLocalData();
    resetSystem();
  };

  const openLink = (link) => {
    if(link) window.open(link, "_blank");
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
        id="logic-gates-tab"
        data-tabs-target="#logic-gates"
        role="tab"
        arial-controls="logic-gates"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Logic Gates</button
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
      <button
        id="stress-tests-tab"
        data-tabs-target="#stress-tests"
        role="tab"
        arial-controls="stress-tests"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        class:hidden={!$system.dev}
        >Stress Tests</button
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
              on:contextmenu={() => openLink(item.link)}
              class="text-gray-500 border-0 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >{item.name}
              </button
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

    <!-- Logic Gates -->
    <div
      class="hidden dark:bg-gray-800"
      id="logic-gates"
      role="tabpanel"
      aria-labelledby="logic-gates-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Logic Gates
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each gates as item}
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

    <!-- Stress Tests -->
    <div
      class="hidden dark:bg-gray-800"
      id="stress-tests"
      role="tabpanel"
      aria-labelledby="stress-tests-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <div>
          <h2 class="text-lg font-semibold text-gray-500 dark:text-gray-400">
            Stress Tests
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Choose a sample to load
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 p-4 border border-gray-400 rounded-xl">
          {#each stressTests as item}
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