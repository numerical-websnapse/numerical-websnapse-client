<script>
  import Setting from "./Setting.svelte";
  import { onMount } from "svelte";
  import { minimap } from "../../../graph/plugins/minimap";
  import { dataValidation } from "../../../utils/validation";
  import { getNotificationsContext } from "svelte-notifications";
  import { graph, setGraphLocalData } from "../../../stores/graph";
  import { resetSystem } from "../../../stores/system";

  const { addNotification } = getNotificationsContext();

  export let nodeOptions;
  export let edgeOptions;
  export let nodeMetaData;
  export let edgeMetaData;

  let files;

  $: files = files?.length ? files : null;

  onMount(() => {
    const dropArea = document.getElementById("drop-area");

    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const highlight = (e) => {
      preventDefaults(e);
      dropArea.classList.add("border-gray-400");
    };

    const unhighlight = (e) => {
      preventDefaults(e);
      dropArea.classList.remove("border-gray-400");
    };

    ["drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, (e) => {
        preventDefaults(e);
        for (const file of e.dataTransfer.files) {
          if (file.type != "application/json") return;
        }

        files = e.dataTransfer.files;
      });
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight);
    });
  });

  const changeGraphData = () => {
    if (!files) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = JSON.parse(e.target.result);
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
    reader.readAsText(files[0]);
  };

  const downloadGraphData = (filename) => {
    let data = localStorage.getItem("data");
    var file = new Blob([data], { type: "application/json" });
    if (window.navigator.msSaveOrOpenBlob)
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      // Others
      var a = document.createElement("a"),
        url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };
</script>

<div class="flex flex-row">
  <!-- Sidebar -->
  <div
    class="text-sm font-medium text-center text-gray-500 border-r border-gray-200 dark:text-gray-400 dark:border-gray-700"
    id="setting-side-tab"
    data-tabs-toggle="#setting-side-content"
    role="tablist"
  >
    <div
      class="flex flex-col flex-wrap py-2 px-2 h-full content-center space-y-2 max-h-[45vh] md:max-h-[60vh]"
    >
      <button
        id="node-setting-tab"
        data-tabs-target="#node-setting"
        role="tab"
        arial-controls="node-setting"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Node</button
      >
      <button
        id="edge-setting-tab"
        data-tabs-target="#edge-setting"
        role="tab"
        arial-controls="edge-setting"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        aria-current="page">Edge</button
      >
      <div class="flex-grow"></div>
      <button
        id="upload-setting-tab"
        data-tabs-target="#upload-setting"
        role="tab"
        arial-controls="upload-setting"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        aria-current="page">Upload</button
      >
      <button
        on:click={() => downloadGraphData("graph.json")}
        class="text-gray-500 border-0 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-cente dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        aria-current="page">Download</button
      >
    </div>
  </div>
  <!-- Contents -->
  <div id="setting-modal-content" class="flex-grow">
    <!-- Node settings content -->
    <div
      class="hidden dark:bg-gray-800"
      id="node-setting"
      role="tabpanel"
      aria-labelledby="node-setting-tab"
    >
      <div
        class="p-6 grid grid-flow-row grid-col-1 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]"
      >
        <Setting bind:options={nodeOptions} bind:metaData={nodeMetaData} name="node-settings" />
      </div>
    </div>
    <!-- Edge settings content -->
    <div
      class="hidden dark:bg-gray-800"
      id="edge-setting"
      role="tabpanel"
      aria-labelledby="edge-setting-tab"
    >
      <div
        class="p-6 grid grid-flow-row grid-col-1 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]"
      >
        <Setting bind:options={edgeOptions} bind:metaData={edgeMetaData} name="edge-settings" />
      </div>
    </div>

    <div
      class="hidden dark:bg-gray-800"
      id="upload-setting"
      role="tabpanel"
      aria-labelledby="upload-setting-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <label
          id="drop-area"
          class="flex justify-center w-full h-[39vh] px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
        >
          <span class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {#if files}
              <h2>Selected files:</h2>
              {#each Array.from(files) as file}
                <span class="font-medium text-gray-600">
                  {file.name} ({file.size} bytes)
                </span>
              {/each}
            {:else}
              <span class="font-medium text-gray-600">
                Drop files to Attach, or
                <span class="text-blue-600 underline">browse</span>
              </span>
            {/if}
          </span>
          <input
            accept=".json"
            bind:files
            id="upload"
            name="upload"
            class="hidden"
            type="file"
          />
        </label>
        <div class="w-full flex justify-center">
          <button on:click={changeGraphData} class="p-2 rounded-xl">
            <span class="text-sm font-medium text-gray-600">
              Change graph data
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
