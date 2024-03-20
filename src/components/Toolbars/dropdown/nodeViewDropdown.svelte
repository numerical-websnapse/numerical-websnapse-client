<script>
    export let id;
    export let updater;
</script>

<div
  {id}
  class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700"
>
  <div class="flex flex-col">

    <!-- Text -->
    <button
      on:click={()=>updater('text')}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" y1="20" x2="15" y2="20"></line>
        <line x1="12" y1="4" x2="12" y2="20"></line>
      </svg>
      <span>Text</span>
    </button>

    <!-- simple -->
    <button
      on:click={()=>updater('simple')}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
      <line class="cls-2" x1="8" y1="16" x2="16" y2="8"/>
      <rect class="cls-3" x="1" y="16" width="7" height="7"/>
      <rect class="cls-3" x="16" y="1" width="7" height="7"/>
      </svg>
      <span>Simple</span>
    </button>

    <!-- Image -->
    <button
      on:click={()=>updater('image')}
      class="flex flex-row w-full space-x-2 rounded-lg px-4 py-2 border-0 place-items-center dark:text-gray-100 hover:bg-blue-700 hover:text-gray-50 active:bg-gray-300 active:text-gray-600 dark:active:bg-gray-700 dark:active:text-gray-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect class="cls-1" x="0.75" y="0.75" width="5" height="5"/>
        <rect class="cls-1" x="17.75" y="0.75" width="5" height="5"/>
        <rect class="cls-1" x="0.75" y="17.75" width="5" height="5"/>
        <rect class="cls-1" x="17.75" y="17.75" width="5" height="5"/>
        <line class="cls-1" x1="3.25" y1="5.75" x2="3.25" y2="17.75"/>
        <line class="cls-1" x1="5.75" y1="20.25" x2="17.75" y2="20.25"/>
        <line class="cls-1" x1="20.25" y1="17.75" x2="20.25" y2="5.75"/>
        <line class="cls-1" x1="17.75" y1="3.25" x2="5.75" y2="3.25"/>
        <polygon class="cls-1" points="11.75 7.75 9.75 7.75 13.75 7.75 11.75 7.75"/>
        <polyline class="cls-1" points="13.75 14.75 9.75 14.75 11.75 14.75 11.75 7.75"/>
      </svg>
      <span>Latex</span>
    </button>
  </div>
</div>