<script lang="ts">
	import { onDestroy } from "svelte";
	import type { Release, SortOption } from "src/components/types";

	// --- Props ---
	export let items: Release[] = [];
	export let searchFields: string[] = [];
	export let sortOptions: SortOption[] = [];
	export let initialSortId: string | null =
		sortOptions.length > 0 ? (sortOptions[0]?.id ?? null) : null;

	// --- Internal State ---
	let searchTerm: string = "";
	let currentSortId: string | null = initialSortId;

	// --- Helper ---
	function getProperty(obj: any, path: string): any {
		try {
			return path
				.split(".")
				.reduce((o, k) => (o && o[k] !== undefined && o[k] !== null ? o[k] : null), obj);
		} catch (e) {
			return null;
		}
	}

	// --- Derived State ---
	$: activeSortOption =
		sortOptions.find((opt) => opt.id === currentSortId) ||
		(sortOptions.length > 0 ? sortOptions[0] : undefined);

	$: displayedItems = (() => {
		const lowerSearchTerm = searchTerm.toLowerCase().trim();
		let filtered = items.filter((item: Release) => {
			if (!lowerSearchTerm) return true;
			return searchFields.some((fieldPath) => {
				if (fieldPath.includes("artists")) {
					const artists = getProperty(item, "basic_information.artists");
					if (Array.isArray(artists)) {
						return artists.some((a) => a.name?.toLowerCase().includes(lowerSearchTerm));
					}
					return false;
				} else {
					const value = getProperty(item, fieldPath);
					if (typeof value === "string") {
						return value.toLowerCase().includes(lowerSearchTerm);
					}
				}
				return false;
			});
		});

		if (activeSortOption) {
			const { valueFn, order } = activeSortOption;
			const sortOrder = order === "asc" ? 1 : -1;

			filtered.sort((a: Release, b: Release) => {
				const valA = valueFn(a);
				const valB = valueFn(b);
				let comparison = 0;
				if (typeof valA === "string" && typeof valB === "string") {
					comparison = valA.localeCompare(valB);
				} else {
					if (valA < valB) comparison = -1;
					if (valA > valB) comparison = 1;
				}
				if (comparison === 0) {
					const titleA = getProperty(a, "basic_information.title") || "";
					const titleB = getProperty(b, "basic_information.title") || "";
					return titleA.localeCompare(titleB);
				}
				return comparison * sortOrder;
			});
		}
		return filtered;
	})();

	// --- Event Handlers ---
	function handleSortClick(id: string) {
		currentSortId = id;
	}

	let debounceTimer: number;
	function handleInput(event: Event) {
		clearTimeout(debounceTimer);
		const target = event.target as HTMLInputElement;
		const value = target.value;
		debounceTimer = window.setTimeout(() => {
			searchTerm = value;
		}, 250);
	}

	onDestroy(() => {
		clearTimeout(debounceTimer);
	});
</script>

<div class="filter-sort-list-container">
	<div class="mb-4">
		<label for="filter-input-{initialSortId ?? 'default'}" class="sr-only">Filter collectie</label>
		<input
			type="text"
			id="filter-input-{initialSortId ?? 'default'}"
			placeholder="Filter..."
			class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			bind:value={searchTerm}
			on:input={handleInput}
		/>
	</div>

	{#if sortOptions.length > 0}
		<div class="mb-6 flex flex-wrap gap-2 items-center">
			<span class="text-sm font-medium mr-2">Sorteer op:</span>
			{#each sortOptions as option (option.id)}
				<button
					class="sort-button p-1 px-3 border rounded-md text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
					class:active={option.id === currentSortId}
					class:bg-blue-100={option.id === currentSortId}
					class:dark:bg-blue-800={option.id === currentSortId}
					class:font-semibold={option.id === currentSortId}
					class:bg-gray-100={option.id !== currentSortId}
					class:dark:bg-gray-700={option.id !== currentSortId}
					on:click={() => handleSortClick(option.id)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}

	<div class="list-items-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
		{#each displayedItems as item (item.id)}
			<slot name="item" {item}></slot>
		{:else}
			<div class="col-span-full">
				<slot name="no-results">
					<p class="mt-6 text-center text-gray-500 dark:text-gray-400">Geen items gevonden.</p>
				</slot>
			</div>
		{/each}
	</div>
</div>
