<script lang="ts">
	import { onDestroy } from "svelte";
	import type { SteamGame, SortOption as GenericSortOption } from "@/types";
	import SteamGameCard from "./SteamGameCard.svelte"; // Importeer kaart weer hier
	import Select from "svelte-select";

	type SteamGameSortKey = keyof SteamGame | "release_date_parsed";
	interface SteamSortOption extends GenericSortOption {
		sortKey: SteamGameSortKey | string;
	}

	export let items: SteamGame[] = [];
	export let searchFields: string[] = [];
	export let sortOptions: SteamSortOption[] = [];
	export let initialSortId: string | null = sortOptions[0] ? sortOptions[0].id : null;
	export let availableGenres: string[] = [];
	export let availableCategories: string[] = [];

	let searchTerm: string = "";
	let currentSortId: string | null = initialSortId;
	let viewMode: "grid" | "list" = "grid";
	let selectedGenres: string[] = [];
	let selectedGenreObjects: { value: string; label: string }[] = [];
	$: selectedGenres = selectedGenreObjects?.map((obj) => obj.value) ?? [];
	let selectedCategories: string[] = [];
	let selectedCategoryObjects: { value: string; label: string }[] = [];
	$: selectedCategories = selectedCategoryObjects?.map((obj) => obj.value) ?? [];

	$: genreOptions = availableGenres.map((g) => ({ value: g, label: g }));
	$: categoryOptions = availableCategories.map((c) => ({ value: c, label: c }));

	let debouncedSearchTerm: string = "";
	let debounceTimer: number;
	$: {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			debouncedSearchTerm = searchTerm;
		}, 300);
	}
	onDestroy(() => clearTimeout(debounceTimer));

	function getProperty(obj: any, path: string): any {
		try {
			if (path.includes(".")) {
				return path
					.split(".")
					.reduce((o, k) => (o && o[k] !== undefined && o[k] !== null ? o[k] : null), obj);
			} else {
				return obj && obj[path] !== undefined && obj[path] !== null ? obj[path] : null;
			}
		} catch (e) {
			return null;
		}
	}

	$: activeSortOption =
		sortOptions.find((opt) => opt.id === currentSortId) ||
		(sortOptions.length > 0 ? sortOptions[0] : undefined);

	$: displayedItems = computeDisplayedItems(
		items,
		debouncedSearchTerm,
		searchFields,
		activeSortOption,
		selectedGenres,
		selectedCategories,
	);

	function computeDisplayedItems(
		originalItems: SteamGame[],
		filterTerm: string,
		fieldsToSearch: string[],
		sortOption: SteamSortOption | undefined,
		selGenres: string[],
		selCategories: string[],
	): SteamGame[] {
		const lowerFilterTerm = filterTerm.toLowerCase().trim();
		let filtered = originalItems.filter((item: SteamGame) => {
			let keep = true;
			if (lowerFilterTerm) {
				const isMatch = fieldsToSearch.some((fieldPath) => {
					const value = getProperty(item, fieldPath);
					if (Array.isArray(value)) {
						return value.some(
							(v) => typeof v === "string" && v.toLowerCase().includes(lowerFilterTerm),
						);
					} else if (typeof value === "string") {
						return value.toLowerCase().includes(lowerFilterTerm);
					} else if (typeof value === "number") {
						return String(value).includes(lowerFilterTerm);
					}
					return false;
				});
				if (!isMatch) keep = false;
			}
			if (keep && selGenres.length > 0) {
				if (!selGenres.every((genre) => item.genres?.includes(genre))) {
					keep = false;
				}
			}
			if (keep && selCategories.length > 0) {
				if (!selCategories.every((cat) => item.categories?.includes(cat))) {
					keep = false;
				}
			}
			return keep;
		});

		if (sortOption) {
			try {
				const { sortKey, order } = sortOption;
				const sortOrder = order === "asc" ? 1 : -1;
				filtered.sort((a: SteamGame, b: SteamGame) => {
					let valA = getProperty(a, sortKey as string);
					let valB = getProperty(b, sortKey as string);
					let comparison = 0;
					const isNumOrDate = ["metacritic_score", "release_date_parsed"].includes(
						sortKey as string,
					);
					const nullValAsc = isNumOrDate ? Infinity : "zzzzzzz";
					const nullValDesc = isNumOrDate ? -Infinity : "";
					const fallback = order === "asc" ? nullValAsc : nullValDesc;
					valA = valA ?? fallback;
					valB = valB ?? fallback;
					if (sortKey === "release_date_parsed") {
						// @ts-ignore
						if (valA < valB) comparison = -1;
						// @ts-ignore
						if (valA > valB) comparison = 1;
					} else if (typeof valA === "string" && typeof valB === "string") {
						comparison = valA.localeCompare(valB);
					} else if (typeof valA === "number" && typeof valB === "number") {
						comparison = valA - valB;
					} else {
						if (String(valA) < String(valB)) comparison = -1;
						if (String(valA) > String(valB)) comparison = 1;
					}
					if (comparison === 0 && sortKey !== "name") {
						const nameA = a.name || "";
						const nameB = b.name || "";
						return nameA.localeCompare(nameB);
					}
					return comparison * sortOrder;
				});
			} catch (e) {
				console.error("Error during sorting:", e);
			}
		}
		return filtered;
	}

	function setViewMode(mode: "grid" | "list") {
		viewMode = mode;
	}
</script>

<div class="filter-sort-container mb-8 space-y-6">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
		<div>
			<label for="steam-filter-input" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Zoeken</label
			>
			<input
				type="text"
				id="steam-filter-input"
				placeholder="Zoek op naam, genre, tag..."
				class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				bind:value={searchTerm}
			/>
		</div>
		{#if sortOptions.length > 0}
			<div>
				<label for="steam-sort-select" class="block text-sm font-medium mb-1 dark:text-gray-300"
					>Sorteer op:</label
				>
				<select
					id="steam-sort-select"
					bind:value={currentSortId}
					class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					{#each sortOptions as option (option.id)}
						<option value={option.id}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
		<div>
			<label for="steam-genres" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Genres</label
			>
			<Select
				id="steam-genres"
				items={genreOptions}
				bind:value={selectedGenreObjects}
				multiple={true}
				placeholder="Selecteer genres..."
				--item-text-color="var(--color-global-text)"
				--item-bg="var(--color-global-bg)"
				--item-hover-bg="rgba(128, 128, 128, 0.2)"
				--input-text-color="var(--color-global-text)"
				--input-placeholder-color="rgba(128, 128, 128, 0.7)"
				--multi-item-bg="var(--color-accent)"
				--multi-item-color="#FFF"
				--border-radius="0.375rem"
				--border="1px solid #D1D5DB"
				--hover-border="1px solid #9CA3AF"
				--focus-box-shadow="0 0 0 2px var(--color-link)"
			/>
		</div>
		<div>
			<label for="steam-categories" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Categorieën / Tags</label
			>
			<Select
				id="steam-categories"
				items={categoryOptions}
				bind:value={selectedCategoryObjects}
				multiple={true}
				placeholder="Selecteer tags..."
				--item-text-color="var(--color-global-text)"
				--item-bg="var(--color-global-bg)"
				--item-hover-bg="rgba(128, 128, 128, 0.2)"
				--input-text-color="var(--color-global-text)"
				--input-placeholder-color="rgba(128, 128, 128, 0.7)"
				--multi-item-bg="var(--color-accent)"
				--multi-item-color="#FFF"
				--border-radius="0.375rem"
				--border="1px solid #D1D5DB"
				--hover-border="1px solid #9CA3AF"
				--focus-box-shadow="0 0 0 2px var(--color-link)"
			/>
		</div>
	</div>

	<div class="flex items-center justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
		<div class="flex gap-1">
			<button
				title="Grid View"
				on:click={() => setViewMode("grid")}
				aria-label="Grid Weergave"
				class:active={viewMode === "grid"}
				aria-pressed={viewMode === "grid"}
				class="p-1 border rounded {viewMode === 'grid'
					? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700'
					: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
					><path
						fill-rule="evenodd"
						d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			<button
				title="List View"
				on:click={() => setViewMode("list")}
				aria-label="Lijst Weergave"
				class:active={viewMode === "list"}
				aria-pressed={viewMode === "list"}
				class="p-1 border rounded {viewMode === 'list'
					? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700'
					: 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
					><path
						fill-rule="evenodd"
						d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5A.75.75 0 0 1 2.75 14h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 14.75Z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
	</div>
</div>

{#if displayedItems.length > 0}
	<div
		class="list-items-container gap-4"
		class:grid={viewMode === "grid"}
		class:grid-cols-2={viewMode === "grid"}
		class:sm:grid-cols-3={viewMode === "grid"}
		class:md:grid-cols-4={viewMode === "grid"}
		class:md:gap-6={viewMode === "grid"}
		class:flex={viewMode === "list"}
		class:flex-col={viewMode === "list"}
	>
		{#each displayedItems as item (item.id)}
			<SteamGameCard game={item} view={viewMode} />
		{/each}
	</div>
{:else}
	<div class="col-span-full py-10 text-center">
		<p class="text-gray-500 dark:text-gray-400">
			Geen spellen gevonden die aan de filters voldoen.
		</p>
	</div>
{/if}

<style>
	:global(html[data-theme="dark"] .svelte-select-list) {
		background-color: #374151;
		border-color: #4b5563;
	}
	:global(html[data-theme="dark"] .svelte-select-item.hover) {
		background-color: #4b5563;
	}
	:global(html[data-theme="dark"] .svelte-select-input) {
		color: #e5e7eb;
	}
	:global(html[data-theme="dark"] .svelte-select .input-container) {
		--border: 1px solid #4b5563;
	}
</style>
