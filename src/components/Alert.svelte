<script>
  import { fade } from "svelte/transition";

  export let notification = {};
  export let onRemove = null;
  export let withoutStyles;

  $: withoutStyles = withoutStyles ? withoutStyles : false;
</script>

{#if notification.type === "error"}
  <div
    class="fixed flex z-[100] p-4 m-4 text-sm border border-red-400 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
    in:fade
    out:fade
  >
    <div class="flex-shrink-0 mr-10">
      <div class="flex items-center">
        <svg
          class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
          />
        </svg>
        <span class="font-medium">{ notification.header }</span>
      </div>
      <ul class="ml-2 mt-1.5 list-disc list-inside">
        {#each notification.messages as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
    <div>
      <button
        type="button"
        on:click={onRemove}
        class="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-800 border-red-400 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
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
      </button>
    </div>
  </div>
{/if}

{#if notification.type === "success"}
  <div
    class="fixed flex z-[60] p-4 m-4 text-sm border items-center border-green-400 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
    in:fade
    out:fade
  >
    <svg
      class="flex-shrink-0 inline w-4 h-4 me-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
      />
    </svg>
    <div class="mr-10">
      {#each notification.messages as success}
        {success}
      {/each}
    </div>
    <div>
      <button
        type="button"
        on:click={onRemove}
        class="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-800 border-green-400 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
      >
        <span class="sr-only">Close</span>
        <svg
          class="w-3 h-3"
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
      </button>
    </div>
  </div>
{/if}
