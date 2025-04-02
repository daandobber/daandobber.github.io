<script lang="ts">
	import { onDestroy } from "svelte";
	import type { BoardGame, SortOption as GenericSortOption } from "@/types";
	import BoardGameCard from "./BoardGameCard.svelte";
	import RangeSlider from "./ui/RangeSlider.svelte";
	import Select from "svelte-select";
	// import 'svelte-select/dist/style.css'; // CSS import verwijderd, styling via props/global CSS

	type BoardGameSortKey = keyof BoardGame;
	interface BoardGameSortOption extends GenericSortOption {
		sortKey: BoardGameSortKey;
	}

	// Props
	export let items: BoardGame[] = [];
	export let searchFields: string[] = [];
	export let sortOptions: BoardGameSortOption[] = [];
	export let initialSortId: string | null = sortOptions[0] ? sortOptions[0].id : null;
	export let availableCategories: string[] = [];
	export let availableMechanics: string[] = []; // <-- Nieuwe prop
	export let initialShowExpansions: boolean = false;

	// Constanten/Config
	let MAX_PLAYTIME_DISPLAY = 360;
	let MAX_WEIGHT = 5.0;

	// Interne State
	let searchTerm: string = "";
	let currentSortId: string | null = initialSortId;
	let showExpansions: boolean = initialShowExpansions;
	let selectedPlayers: number | null = null;
	let filterBestWith: boolean = false;
	// Categorie Selectie State
	let selectedCategories: string[] = [];
	let selectedCategoryObjects: { value: string; label: string }[] = [];
	$: selectedCategories = selectedCategoryObjects?.map((obj) => obj.value) ?? [];
	// Mechanisme Selectie State <-- NIEUW
	let selectedMechanics: string[] = [];
	let selectedMechanicObjects: { value: string; label: string }[] = [];
	$: selectedMechanics = selectedMechanicObjects?.map((obj) => obj.value) ?? [];
	// Range Slider State
	let minPlaytime: number = 0;
	let maxPlaytime: number = MAX_PLAYTIME_DISPLAY;
	let minWeight: number = 0;
	let maxWeight: number = MAX_WEIGHT;

	// Computed options voor de dropdowns
	$: categoryOptions = availableCategories.map((cat) => ({ value: cat, label: cat }));
	$: mechanicOptions = availableMechanics.map((mech) => ({ value: mech, label: mech })); // <-- NIEUW

	// Debounce
	let debouncedSearchTerm: string = "";
	let debounceTimer: number;
	$: {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			debouncedSearchTerm = searchTerm;
		}, 300);
	}
	onDestroy(() => clearTimeout(debounceTimer));

	// Helper
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

	// Compute displayed items (reactief)
	$: activeSortOption =
		sortOptions.find((opt) => opt.id === currentSortId) ||
		(sortOptions.length > 0 ? sortOptions[0] : undefined);
	$: effectiveMaxPlaytime = maxPlaytime >= MAX_PLAYTIME_DISPLAY ? 99999 : maxPlaytime;

	$: displayedItems = computeDisplayedItems(
		items,
		debouncedSearchTerm,
		searchFields,
		activeSortOption,
		showExpansions,
		selectedPlayers,
		filterBestWith,
		selectedCategories,
		selectedMechanics, // <-- Nieuw argument doorgeven
		minPlaytime,
		effectiveMaxPlaytime,
		minWeight,
		maxWeight,
	);

	// Filter & Sort Logic
	function computeDisplayedItems(
		originalItems: BoardGame[],
		filterTerm: string,
		fieldsToSearch: string[],
		sortOption: BoardGameSortOption | undefined,
		showExp: boolean,
		numPlayers: number | null,
		bestWith: boolean,
		selCategories: string[],
		selMechanics: string[], // <-- Nieuwe parameter ontvangen
		minTime: number,
		maxTime: number,
		minW: number,
		maxW: number,
	): BoardGame[] {
		const lowerFilterTerm = filterTerm.toLowerCase().trim();

		let filtered = originalItems.filter((item: BoardGame) => {
			if (!showExp && item.is_expansion) {
				return false;
			}
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
				if (!isMatch) return false;
			}
			if (numPlayers !== null && numPlayers > 0) {
				const minP = item.minplayers ?? 0;
				const maxP = item.maxplayers ?? 0;
				if (!minP || !maxP || !(minP <= numPlayers && maxP >= numPlayers)) {
					return false;
				}
				if (bestWith) {
					if (!item.best_with_players) return false;
					const best = item.best_with_players;
					try {
						if (best.endsWith("+")) {
							const bestMin = parseInt(best.slice(0, -1));
							if (numPlayers < bestMin) return false;
						} else {
							const bestExact = parseInt(best);
							if (numPlayers !== bestExact) return false;
						}
					} catch (e) {
						return false;
					}
				}
			}
			if (selCategories.length > 0) {
				if (!selCategories.every((cat) => item.categories?.includes(cat))) return false;
			}
			// NIEUWE FILTER LOGICA VOOR MECHANISMEN (AND)
			if (selMechanics.length > 0) {
				if (!selMechanics.every((mech) => item.mechanics?.includes(mech))) return false;
			}
			// ---
			const gameMinTime = item.minplaytime ?? item.playingtime ?? null;
			const gameMaxTime = item.maxplaytime ?? item.playingtime ?? null;
			if ((minTime > 0 || maxTime < 99999) && gameMinTime !== null && gameMaxTime !== null) {
				if (gameMaxTime < minTime || gameMinTime > maxTime) {
					return false;
				}
			} else if (
				(minTime > 0 || maxTime < 99999) &&
				(gameMinTime === null || gameMaxTime === null)
			) {
				return false;
			}
			const weight = item.weight ?? null;
			if ((minW > 0 || maxW < MAX_WEIGHT) && weight !== null) {
				if (weight < minW || weight > maxW) {
					return false;
				}
			} else if ((minW > 0 || maxW < MAX_WEIGHT) && weight === null) {
				return false;
			}
			return true;
		});

		// Sorteer logica (blijft hetzelfde)
		if (sortOption) {
			const { sortKey, order } = sortOption;
			const sortOrder = order === "asc" ? 1 : -1;
			filtered.sort((a: BoardGame, b: BoardGame) => {
				let valA = getProperty(a, sortKey as string);
				let valB = getProperty(b, sortKey as string);
				const nullValAsc =
					typeof getProperty(a, sortKey as string) === "number" ||
					typeof getProperty(b, sortKey as string) === "number"
						? Infinity
						: "zzzzzzz";
				const nullValDesc =
					typeof getProperty(a, sortKey as string) === "number" ||
					typeof getProperty(b, sortKey as string) === "number"
						? -Infinity
						: "";
				const fallback = order === "asc" ? nullValAsc : nullValDesc;
				valA = valA ?? fallback;
				valB = valB ?? fallback;
				let comparison = 0;
				if (typeof valA === "string" && typeof valB === "string") {
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
		}
		return filtered;
	}

	// Event Handler (alleen player input nog nodig)
	function handlePlayerInputChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		selectedPlayers = value ? parseInt(value, 10) : null;
		if (selectedPlayers !== null && selectedPlayers < 1) selectedPlayers = 1;
		if (selectedPlayers === null) {
			filterBestWith = false;
		}
	}
</script>

<div class="filter-sort-container mb-8 space-y-6">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
		<div>
			<label for="bgg-filter-input" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Zoeken</label
			>
			<input
				type="text"
				id="bgg-filter-input"
				placeholder="Zoek op naam, categorie, jaar..."
				class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				bind:value={searchTerm}
			/>
		</div>
		<div class="flex items-end gap-2">
			<div class="flex-grow">
				<label for="bgg-player-count" class="block text-sm font-medium mb-1 dark:text-gray-300"
					>Speelbaar met</label
				>
				<input
					type="number"
					id="bgg-player-count"
					min="1"
					placeholder="Aantal"
					class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					on:input={handlePlayerInputChange}
					bind:value={selectedPlayers}
				/>
			</div>
			<div class="pb-1">
				<label
					class="flex items-center gap-1 whitespace-nowrap cursor-pointer has-[:disabled]:cursor-not-allowed"
				>
					<input
						type="checkbox"
						class="rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						bind:checked={filterBestWith}
						disabled={selectedPlayers === null || selectedPlayers < 1}
					/>
					<span class="text-sm dark:text-gray-300 has-[:disabled]:opacity-50"
						>Alleen 'Best with'</span
					>
				</label>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
		<RangeSlider
			label="Speelduur (minuten)"
			min={0}
			max={MAX_PLAYTIME_DISPLAY}
			step={15}
			bind:valueMin={minPlaytime}
			bind:valueMax={maxPlaytime}
		/>

		<RangeSlider
			label="Complexiteit / Gewicht"
			min={0}
			max={MAX_WEIGHT}
			step={0.1}
			bind:valueMin={minWeight}
			bind:valueMax={maxWeight}
		/>

		<div>
			<label for="bgg-categories" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Categorieën</label
			>
			<Select
				id="bgg-categories"
				items={categoryOptions}
				bind:value={selectedCategoryObjects}
				multiple={true}
				placeholder="Selecteer categorieën..."
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
			<label for="bgg-mechanics" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Mechanismen</label
			>
			<Select
				id="bgg-mechanics"
				items={mechanicOptions}
				bind:value={selectedMechanicObjects}
				multiple={true}
				placeholder="Selecteer mechanismen..."
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

		{#if sortOptions.length > 0}
			<div class="md:col-span-2">
				<label for="sort-select" class="block text-sm font-medium mb-1 dark:text-gray-300"
					>Sorteer op:</label
				>
				<select
					id="sort-select"
					bind:value={currentSortId}
					class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				>
					{#each sortOptions as option (option.id)}
						<option value={option.id}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/if}

		<div class="flex items-center md:col-start-2 md:justify-end">
			<label class="flex items-center gap-2 cursor-pointer">
				<input
					type="checkbox"
					class="rounded text-blue-600 focus:ring-blue-500"
					bind:checked={showExpansions}
				/>
				<span class="text-sm dark:text-gray-300">Toon uitbreidingen</span>
			</label>
		</div>
	</div>
</div>

{#if displayedItems.length > 0}
	<div class="list-items-container grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
		{#each displayedItems as item (item.id)}
			<BoardGameCard game={item} />
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
