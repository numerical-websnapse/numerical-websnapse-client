<script>
  import { LoopEdge } from "@antv/g6/lib/stdlib/item/edge";

  export let options;
	export let name;

	const isColor = (value) => {
		return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
	}

	const isInvalidPath = (s) => {
		const reEverythingAllowed = /[MmZzLlHhVvCcSsQqTtAa0-9-,.\s]/g;

		const bContainsIllegalCharacter = !!s.replace(reEverythingAllowed,'').length;
		const bContainsAdjacentLetters = /[a-zA-Z][a-zA-Z]/.test(s);
		const bInvalidStart = /^[0-9-,.]/.test(s);
		const bInvalidEnd = /.*[-,.]$/.test(s.trim());

		return bContainsIllegalCharacter || bContainsAdjacentLetters || bInvalidStart || bInvalidEnd;
	}

	function camelCaseToHumanReadable(camelCaseString) {
    const spacedString = camelCaseString.replace(/([A-Z])/g, ' $1');
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
	}

	const isPercentage = (input) => {
		const percentageRegex = /^-?\d+(\.\d+)?%$/;
		return percentageRegex.test(input);
  	}

	const handlePercentage = (e, value) => {
		if (isPercentage(e.target.value)) return;
		e.preventDefault();
		e.target.value = '100%';
		value = '100%';
	}

	const handleNumber = (e, value) => {
		if (e.target.value === '' || isNaN(e.target.value)) {
			e.preventDefault();
			e.target.value = 0;
			value = 0
		};
	}

	$: entries = Object.entries(options);
</script>

<!-- ASSUME ONLY ONE LEVEL OBJECTS -->
{#each entries as [key, value]}
	<!-- Type: Number -->
	{#if value === null || typeof value === "number"}
	<div class="mb-2">
		<label
			for={name+'-'+key}
			class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>{camelCaseToHumanReadable(key)}</label
		>
		<input
			type="number"
			id={name+'-'+key}
			class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			placeholder={value}
			bind:value={options[key]}
			on:input={(e) => handleNumber(e, options[key])}
		/>
	</div>
	
	<!-- Type: Array -->
	{:else if Array.isArray(value)}
	<div class="flex flex-row flex-grow gap-4">
		{#each value as val, index}
		<div class="basis-1/2">
			<label
				for={name+'-'+key+'-'+index}
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{camelCaseToHumanReadable(key) + ' ' + index}</label
			>
			{#if val === null || typeof val === "number"}
				<input
					type="number"
					id={name+'-'+key+'-'+index}
					class="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					bind:value={value[index]}
					on:input={(e) => handleNumber(e, value[index])}
				/>
			{:else}
				<input
					type="text"
					id={name+'-'+key+'-'+index}
					class="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					bind:value={value[index]}
					on:input={(e) => handlePercentage(e, value[index])}
				/>
			{/if}
		</div>
		{/each}
	</div>

	<!-- Type: Object -->
  {:else if typeof value === "object"}
    <div class="flex border-b-2 border-slate-900">
			<h6 class="text-lg font-bold uppercase dark:text-white">
				{camelCaseToHumanReadable(key)}
			</h6>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<svelte:self bind:options={options[key]} name={name+'-'+key}/>
		</div>
		
	<!-- Type: String -->
  {:else if typeof value === "string"}
    <div class="flex flex-col mb-2">
      <label
        for={name+'-'+key}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >{camelCaseToHumanReadable(key)}</label
      >
			<!-- If color - use color picker -->
			{#if isColor(value)}
				<input
					type="color"
					id={name+'-'+key}
					class="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					bind:value={options[key]}
				/>
			<!-- Else - use simple text -->
			{:else}
				<input
					type="text"
					id={name+'-'+key}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder={value}
					bind:value={options[key]}
				/>
			{/if}
    </div>
	{:else if typeof value === "boolean"}
		<div class="flex flex-col mb-2">
			<label
				for={name+'-'+key}
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{camelCaseToHumanReadable(key)}</label
			>
			<input
				type="checkbox"
				id={name+'-'+key}
				class="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				bind:checked={options[key]}
			/>
		</div>
  {/if}
{/each}
