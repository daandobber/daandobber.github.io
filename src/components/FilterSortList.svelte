<script lang="ts">
	import { onDestroy } from "svelte";
	// Gebruik correcte alias voor types
	import type { Release, SortOption, Artist } from "@/types";

	// --- Props ---
	export let items: Release[] = [];
	export let searchFields: string[] = [];
	export let sortOptions: SortOption[] = [];

	// --- CORRECTIE HIER voor initialSortId ---
	// Haal de eerste optie apart op
	const firstOption = sortOptions[0];
	// Gebruik die variabele om de default waarde veiliger te bepalen
	export let initialSortId: string | null = firstOption ? firstOption.id : null;
	// --- EINDE CORRECTIE ---

	// --- Internal State ---
	let searchTerm: string = "";
	let currentSortId: string | null = initialSortId; // Nu geïnitialiseerd met de veiligere waarde
	let debouncedSearchTerm: string = "";

	// --- Debounce Logic ---
	let debounceTimer: number;
	$: {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			debouncedSearchTerm = searchTerm;
		}, 250);
	}
	onDestroy(() => {
		clearTimeout(debounceTimer);
	});

	// --- Helpers ---
	function getProperty(obj: any, path: string): any {
		try {
			return path
				.split(".")
				.reduce((o, k) => (o && o[k] !== undefined && o[k] !== null ? o[k] : null), obj);
		} catch (e) {
			return null;
		}
	}

	function formatArtistsForSort(artists: Artist[] | undefined): string {
		if (!artists || artists.length === 0) return "zzzzzzz";
		return artists
			.map((artist: Artist) => artist.name)
			.join(", ")
			.toLowerCase();
	}

	// --- Derived State ---
	$: activeSortOption =
		sortOptions.find((opt) => opt.id === currentSortId) ||
		(sortOptions.length > 0 ? sortOptions[0] : undefined);
	$: displayedItems = computeDisplayedItems(
		items,
		debouncedSearchTerm,
		searchFields,
		activeSortOption,
	);

	function computeDisplayedItems(
		originalItems: Release[],
		filterTerm: string,
		fieldsToSearch: string[],
		sortOption?: SortOption,
	): Release[] {
		const lowerFilterTerm = filterTerm.toLowerCase().trim();

		let filtered = originalItems.filter((item: Release) => {
			if (!lowerFilterTerm) return true;
			return fieldsToSearch.some((fieldPath) => {
				if (fieldPath.includes("artists")) {
					const artists = getProperty(item, "basic_information.artists");
					return (
						Array.isArray(artists) &&
						artists.some((a) => a.name?.toLowerCase().includes(lowerFilterTerm))
					);
				} else {
					const value = getProperty(item, fieldPath);
					return typeof value === "string" && value.toLowerCase().includes(lowerFilterTerm);
				}
			});
		});

		if (sortOption) {
			const { sortKey, order } = sortOption;
			const sortOrder = order === "asc" ? 1 : -1;

			filtered.sort((a: Release, b: Release) => {
				let valA: string | number;
				let valB: string | number;

				switch (sortKey) {
					case "artist":
						valA = formatArtistsForSort(a.basic_information?.artists);
						valB = formatArtistsForSort(b.basic_information?.artists);
						break;
					case "year":
						valA = a.basic_information?.year ?? (order === "asc" ? 9999 : 0);
						valB = b.basic_information?.year ?? (order === "asc" ? 9999 : 0);
						break;
					case "title":
						valA = getProperty(a, "basic_information.title") || "";
						valB = getProperty(b, "basic_information.title") || "";
						break;
					default:
						valA = 0;
						valB = 0;
				}

				let comparison = 0;
				if (typeof valA === "string" && typeof valB === "string") {
					comparison = valA.localeCompare(valB);
				} else {
					if (valA < valB) comparison = -1;
					if (valA > valB) comparison = 1;
				}

				if (comparison === 0 && sortKey !== "title") {
					const titleA = getProperty(a, "basic_information.title") || "";
					const titleB = getProperty(b, "basic_information.title") || "";
					return titleA.localeCompare(titleB);
				}
				return comparison * sortOrder;
			});
		}
		return filtered;
	}

	// --- Event Handler ---
	function handleSortClick(id: string) {
		currentSortId = id;
	}
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
