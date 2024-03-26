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
  const currentRenderer = localStorage.getItem("renderer") || "canvas";

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

  const changeRenderer = (e) => {
    localStorage.setItem("renderer", e.target.value);
    location.reload();
  };

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
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 align-middle justify-center"
        >Node</button
      >
      <button
        id="edge-setting-tab"
        data-tabs-target="#edge-setting"
        role="tab"
        arial-controls="edge-setting"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        aria-current="page">Edge</button
      >
      <button
        id="graph-setting-tab"
        data-tabs-target="#graph-setting"
        role="tab"
        arial-controls="graph-setting"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        aria-current="page">Graph</button
      >
      <div class="flex-grow"></div>
      <button
        id="upload-setting-tab"
        data-tabs-target="#upload-setting"
        role="tab"
        arial-controls="upload-setting"
        arial-selected="false"
        class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        aria-current="page">Upload</button
      >
      <button
        on:click={() => downloadGraphData("graph.json")}
        class="text-gray-500 hover:text-white hover:bg-blue-800 border-gray-100 dark:border-0 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-gray-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
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
        <Setting
          bind:options={nodeOptions}
          bind:metaData={nodeMetaData}
          name="node-settings"
        />
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
        <Setting
          bind:options={edgeOptions}
          bind:metaData={edgeMetaData}
          name="edge-settings"
        />
      </div>
    </div>

    <!-- Graph settings content -->
    <div
      class="hidden dark:bg-gray-800"
      id="graph-setting"
      role="tabpanel"
      aria-labelledby="graph-setting-tab"
    >
      <div
        class="p-6 grid grid-flow-row grid-col-1 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]"
        on:change={changeRenderer}
      >
        <label
          for="select-renderer-type"
          class="text-sm font-medium text-gray-900 dark:text-white items-center flex flex-row space-x-2"
        >
          Renderer
          <button
            data-popover-target="renderer-info"
            data-popover-placement="right"
            class="border-0"
            type="button"
            ><svg
              class="w-4 h-4 ms-2 text-gray-400 hover:text-gray-500"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              ></path></svg
            ><span class="sr-only">Show information</span></button
          >
          <div
            data-popover
            id="renderer-info"
            role="tooltip"  
            class="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-500 rounded-lg shadow-sm opacity-0 w-[22rem] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
          >
            <div class="p-3 space-y-2 text-justify">
              <p>
                <b>NOTE</b>: Changing the renderer type will reload the application.
              </p>
              <h3 class="font-semibold text-gray-900 dark:text-white">Canvas</h3>
              <ul class="list-disc list-inside">
                <li>Default renderer, suitable for large graphs</li>
                <li>Created edges will not displaying right away</li>
                <li>Some nodes stutter when updated</li>
              </ul>
              <h3 class="font-semibold text-gray-900 dark:text-white">SVG</h3>
              <ul class="list-disc list-inside">
                <li>Suitable for small graphs</li>
                <li>Node texts are selectable (not intended)</li>
                <li>Easier to create systems</li>
              </ul>
              <h3 class="font-semibold text-gray-900 dark:text-white">WebGL</h3>
              <p>
                Not fully implemented yet for this application, further updates will be made in the future.
              </p>
            </div>
            <div data-popper-arrow></div>
          </div>
        </label>
        <select
          id="select-renderer-type"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="canvas" selected={currentRenderer === "canvas"}>Canvas</option>
          <option value="svg" selected={currentRenderer === "svg"}>SVG</option>
          <option value="webgl" selected={currentRenderer === "webgl"} disabled>WebGL</option>
        </select>
      </div>
    </div>

    <!-- Upload settings content -->
    <div
      class="hidden dark:bg-gray-800"
      id="upload-setting"
      role="tabpanel"
      aria-labelledby="upload-setting-tab"
    >
      <div class="p-6 space-y-3 overflow-y-auto max-h-[45vh] md:max-h-[60vh]">
        <label
          id="drop-area"
          class="flex justify-center w-full h-[39vh] px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
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
              <h2 class="dark:text-gray-300">Selected files:</h2>
              {#each Array.from(files) as file}
                <span class="font-medium text-gray-600 dark:text-white">
                  {file.name} ({file.size} bytes)
                </span>
              {/each}
            {:else}
              <span class="font-medium text-gray-600 dark:text-white">
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
            <span class="text-sm font-medium text-gray-600 dark:text-white">
              Change graph data
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
