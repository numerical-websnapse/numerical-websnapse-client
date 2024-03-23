<script>
  	export let options;
	export let metaData;
	export let name;

	const isInvalidPath = (s) => {
		const reEverythingAllowed = /[MmZzLlHhVvCcSsQqTtAa0-9-,.\s]/g;

		const bContainsIllegalCharacter = !!s.replace(reEverythingAllowed,'').length;
		const bContainsAdjacentLetters = /[a-zA-Z][a-zA-Z]/.test(s);
		const bInvalidStart = /^[0-9-,.]/.test(s);
		const bInvalidEnd = /.*[-,.]$/.test(s.trim());

		return bContainsIllegalCharacter || bContainsAdjacentLetters || bInvalidStart || bInvalidEnd;
	}

	const handleNumber = (e, value) => {
		if (e.target.value === '' || isNaN(e.target.value)) {
			e.preventDefault();
			e.target.value = 0;
			value = 0
		};
	}

	const handlePath = (e, value) => {
		if (isInvalidPath(e.target.value)) {
			e.preventDefault();
			e.target.value = value;
		}
	}

	$: entries = Object.entries(options);
</script>

{#each entries as [key, value]}
	{#if metaData[key]['visible']}

		{#if metaData[key]['type'] === 'object'}
			<div class="flex border-b-2 border-slate-900">
				<h6 class="text-lg font-bold uppercase dark:text-white">
					{metaData[key]['name']}
				</h6>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<svelte:self bind:options={options[key]} bind:metaData={metaData[key]['value']} name={name+'-'+key}/>
			</div>

		{:else if metaData[key]['type'] === 'string'}
			<div class="flex flex-col mb-2">
				<label
					for={name+'-'+key}
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{metaData[key]['name']}</label
				>
				<input
					type="text"
					id={name+'-'+key}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder={value}
					bind:value={options[key]}
				/>
			</div>

		{:else if metaData[key]['type'] === 'color'}
			<div class="flex flex-col mb-2">
				<label
					for={name+'-'+key}
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{metaData[key]['name']}</label
				>
				<input
					type="color"
					id={name+'-'+key}
					class="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					bind:value={options[key]}
				/>
			</div>

		{:else if metaData[key]['type'] === 'number'}
			<div class="flex flex-col mb-2">
				<label
					for={name+'-'+key}
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{metaData[key]['name']}</label
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

		{:else if metaData[key]['type'] === 'boolean'}
			<div class="flex flex-col mb-2">
				<label
					for={name+'-'+key}
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{metaData[key]['name']}</label
				>
				<input
					type="checkbox"
					id={name+'-'+key}
					class="bg-gray-50 border h-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
					bind:checked={options[key]}
				/>
			</div>
			
		{:else if metaData[key]['type'] === 'path'}
			<div class="flex flex-col mb-2">
				<label
					for={name+'-'+key}
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>{metaData[key]['name']}</label
				>
				<input
					type="text"
					id={name+'-'+key}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder={value}
					bind:value={options[key]}
					on:input={(e) => handlePath(e, options[key])}
				/>
			</div>
		{/if}
	{/if}
{/each}
