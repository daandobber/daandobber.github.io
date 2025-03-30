<script lang="ts">
	import { onDestroy } from "svelte";
	import type { BoardGame, SortOption as GenericSortOption } from "@/types"; // Gebruik generieke SortOption of maak BoardGameSortOption
	import BoardGameCard from "./BoardGameCard.svelte"; // Importeer je card component

	// Definieer een specifiek type voor sort keys hier als je GenericSortOption gebruikt
	type BoardGameSortKey = keyof BoardGame; // Of specifieke keys: 'name' | 'yearpublished' | 'weight' | ...
	interface BoardGameSortOption extends GenericSortOption {
		sortKey: BoardGameSortKey;
	}

	// Props
	export let items: BoardGame[] = [];
	export let searchFields: string[] = []; // bv. ['name', 'categories', 'mechanics']
	export let sortOptions: BoardGameSortOption[] = []; // Gebruik het specifiekere type
	export let initialSortId: string | null = sortOptions[0] ? sortOptions[0].id : null;
	export let availableCategories: string[] = [];
	export let initialShowExpansions: boolean = false;

	// Constanten voor sliders (veranderd naar 'let' om ze beschikbaar te maken in template)
	let MAX_PLAYTIME_DISPLAY = 360; // Max waarde voor de slider UI (kan hoger zijn in data)
	let MAX_WEIGHT = 5.0;

	// Interne state voor filters
	let searchTerm: string = "";
	let currentSortId: string | null = initialSortId;
	let showExpansions: boolean = initialShowExpansions;
	let selectedPlayers: number | null = null; // Voor 'Speelbaar met X'
	let filterBestWith: boolean = false; // Voor 'Best met X'
	let selectedCategories: string[] = [];
	let minPlaytime: number = 0;
	let maxPlaytime: number = MAX_PLAYTIME_DISPLAY; // Start slider op max display waarde
	let minWeight: number = 0;
	let maxWeight: number = MAX_WEIGHT; // Start slider op BGG max

	// Debounce search input
	let debouncedSearchTerm: string = "";
	let debounceTimer: number;
	$: {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			debouncedSearchTerm = searchTerm;
		}, 300);
	}
	onDestroy(() => clearTimeout(debounceTimer));

	// Helper om geneste properties veilig op te halen
	function getProperty(obj: any, path: string): any {
		try {
			// Ondersteun directe keys en geneste keys
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

	// Bereken gefilterde en gesorteerde items reactief
	$: activeSortOption =
		sortOptions.find((opt) => opt.id === currentSortId) ||
		(sortOptions.length > 0 ? sortOptions[0] : undefined);

	$: displayedItems = computeDisplayedItems(
		items,
		debouncedSearchTerm,
		searchFields,
		activeSortOption,
		showExpansions,
		selectedPlayers,
		filterBestWith,
		selectedCategories,
		minPlaytime,
		maxPlaytime >= MAX_PLAYTIME_DISPLAY ? 99999 : maxPlaytime, // Gebruik hoge waarde als slider op max staat
		minWeight,
		maxWeight,
	);

	function computeDisplayedItems(
		originalItems: BoardGame[],
		filterTerm: string,
		fieldsToSearch: string[],
		sortOption: BoardGameSortOption | undefined,
		showExp: boolean,
		numPlayers: number | null,
		bestWith: boolean,
		selCategories: string[],
		minTime: number,
		maxTime: number, // Dit is nu de effectieve max tijd (kan 99999 zijn)
		minW: number,
		maxW: number,
	): BoardGame[] {
		const lowerFilterTerm = filterTerm.toLowerCase().trim();

		let filtered = originalItems.filter((item: BoardGame) => {
			// 1. Expansie filter
			if (!showExp && item.is_expansion) {
				return false;
			}

			// 2. Tekst filter
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
						// Sta toe om op nummers te zoeken (bv. jaar)
						return String(value).includes(lowerFilterTerm);
					}
					return false;
				});
				if (!isMatch) return false;
			}

			// 3. Spelers filter
			if (numPlayers !== null && numPlayers > 0) {
				const minP = item.minplayers ?? 0;
				const maxP = item.maxplayers ?? 0;
				// Spel moet geschikt zijn voor het aantal spelers
				// Check of min/max bestaan, anders kan het niet matchen
				if (!minP || !maxP || !(minP <= numPlayers && maxP >= numPlayers)) {
					return false;
				}
				// 3b. 'Best with' filter (alleen als 'Speelbaar met' ook is voldaan)
				if (bestWith) {
					if (!item.best_with_players) return false; // Geen 'best with' data
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
					} // Ongeldige 'best_with_players' string
				}
			}

			// 4. Categorie filter (matcht als *minstens één* geselecteerde categorie aanwezig is)
			if (selCategories.length > 0) {
				const hasAnyCat = selCategories.some((cat) => item.categories?.includes(cat));
				if (!hasAnyCat) return false;
			}

			// 5. Speeltijd filter (slider)
			const gameMinTime = item.minplaytime ?? item.playingtime ?? null;
			const gameMaxTime = item.maxplaytime ?? item.playingtime ?? null;

			// Alleen filteren als we geldige filtergrenzen hebben EN het spel tijdinfo heeft
			if ((minTime > 0 || maxTime < 99999) && gameMinTime !== null && gameMaxTime !== null) {
				// Logica: Overlapt de range [gameMinTime, gameMaxTime] met [minTime, maxTime]?
				// Het spel past *niet* als het *volledig* buiten de slider valt
				if (gameMaxTime < minTime || gameMinTime > maxTime) {
					return false;
				}
			} else if (
				(minTime > 0 || maxTime < 99999) &&
				(gameMinTime === null || gameMaxTime === null)
			) {
				// Als gebruiker filtert op tijd, maar spel geen tijdinfo heeft -> verberg
				return false;
			}

			// 6. Gewicht/Complexiteit filter (slider)
			const weight = item.weight ?? null;
			if ((minW > 0 || maxW < MAX_WEIGHT) && weight !== null) {
				if (weight < minW || weight > maxW) {
					return false;
				}
			} else if ((minW > 0 || maxW < MAX_WEIGHT) && weight === null) {
				// Als gebruiker filtert op gewicht, maar spel geen gewicht heeft -> verberg
				return false;
			}

			return true; // Item voldoet aan alle filters
		});

		// Sorteren
		if (sortOption) {
			const { sortKey, order } = sortOption;
			const sortOrder = order === "asc" ? 1 : -1;

			filtered.sort((a: BoardGame, b: BoardGame) => {
				let valA = getProperty(a, sortKey as string);
				let valB = getProperty(b, sortKey as string);

				// Bepaal standaard/fallback waarden voor sorteren op null/undefined
				// Lagere waarden komen eerst bij 'asc', hogere waarden bij 'desc'
				const nullValAsc =
					typeof getProperty(a, sortKey as string) === "number" ||
					typeof getProperty(b, sortKey as string) === "number"
						? Infinity
						: "zzzzzzz"; // Hoge waarde voor nummers/strings bij asc
				const nullValDesc =
					typeof getProperty(a, sortKey as string) === "number" ||
					typeof getProperty(b, sortKey as string) === "number"
						? -Infinity
						: ""; // Lage waarde voor nummers/strings bij desc

				const fallback = order === "asc" ? nullValAsc : nullValDesc;

				valA = valA ?? fallback;
				valB = valB ?? fallback;

				let comparison = 0;
				if (typeof valA === "string" && typeof valB === "string") {
					comparison = valA.localeCompare(valB);
				} else if (typeof valA === "number" && typeof valB === "number") {
					comparison = valA - valB;
				} else {
					// Fallback voor gemixte types (probeer te vergelijken)
					if (String(valA) < String(valB)) comparison = -1;
					if (String(valA) > String(valB)) comparison = 1;
				}

				// Fallback sortering op naam als primaire sortering gelijk is
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

	// --- Event Handlers ---
	function handleSortClick(id: string) {
		currentSortId = id;
	}

	function handlePlayerInputChange(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		selectedPlayers = value ? parseInt(value, 10) : null;
		if (selectedPlayers !== null && selectedPlayers < 1) selectedPlayers = 1; // Min 1 speler
		// Reset 'Best with' als aantal spelers wordt gewist
		if (selectedPlayers === null) {
			filterBestWith = false;
		}
	}

	function handleSliderChange(
		type: "minTime" | "maxTime" | "minWeight" | "maxWeight",
		event: Event,
	) {
		const value = parseFloat((event.target as HTMLInputElement).value);
		switch (type) {
			case "minTime":
				minPlaytime = value;
				break;
			case "maxTime":
				maxPlaytime = value;
				break;
			case "minWeight":
				minWeight = value;
				break;
			case "maxWeight":
				maxWeight = value;
				break;
		}
	}

	// Zorg dat max slider niet kleiner is dan min slider
	$: if (maxPlaytime < minPlaytime) maxPlaytime = minPlaytime;
	$: if (maxWeight < minWeight) maxWeight = minWeight;
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

	<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
		<div class="space-y-1">
			<span class="block text-sm font-medium dark:text-gray-300">Speelduur (minuten)</span>
			<div class="flex gap-2 items-center">
				<label for="min-playtime" class="text-xs w-8 text-right dark:text-gray-400"
					>{minPlaytime}</label
				>
				<input
					type="range"
					id="min-playtime"
					min="0"
					max={MAX_PLAYTIME_DISPLAY}
					step="15"
					value={minPlaytime}
					on:input={(e) => handleSliderChange("minTime", e)}
					class="w-full accent-blue-600 slider-range focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
				/>
			</div>
			<div class="flex gap-2 items-center">
				<label for="max-playtime" class="text-xs w-8 text-right dark:text-gray-400"
					>{maxPlaytime >= MAX_PLAYTIME_DISPLAY ? `${MAX_PLAYTIME_DISPLAY}+` : maxPlaytime}</label
				>
				<input
					type="range"
					id="max-playtime"
					min="0"
					max={MAX_PLAYTIME_DISPLAY}
					step="15"
					value={maxPlaytime}
					on:input={(e) => handleSliderChange("maxTime", e)}
					class="w-full accent-blue-600 slider-range focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
				/>
			</div>
		</div>

		<div class="space-y-1">
			<span class="block text-sm font-medium dark:text-gray-300">Complexiteit / Gewicht</span>
			<div class="flex gap-2 items-center">
				<label for="min-weight" class="text-xs w-8 text-right dark:text-gray-400"
					>{minWeight.toFixed(1)}</label
				>
				<input
					type="range"
					id="min-weight"
					min="0"
					max={MAX_WEIGHT}
					step="0.1"
					value={minWeight}
					on:input={(e) => handleSliderChange("minWeight", e)}
					class="w-full accent-red-600 slider-range focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
				/>
			</div>
			<div class="flex gap-2 items-center">
				<label for="max-weight" class="text-xs w-8 text-right dark:text-gray-400"
					>{maxWeight.toFixed(1)}</label
				>
				<input
					type="range"
					id="max-weight"
					min="0"
					max={MAX_WEIGHT}
					step="0.1"
					value={maxWeight}
					on:input={(e) => handleSliderChange("maxWeight", e)}
					class="w-full accent-red-600 slider-range focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
				/>
			</div>
		</div>

		<div>
			<label for="bgg-categories" class="block text-sm font-medium mb-1 dark:text-gray-300"
				>Categorieën</label
			>
			<select
				id="bgg-categories"
				multiple
				class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full h-24 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
				bind:value={selectedCategories}
			>
				{#each availableCategories as category (category)}
					<option value={category}>{category}</option>
				{/each}
			</select>
			<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
				Houd Ctrl/Cmd ingedrukt om meerdere te selecteren.
			</p>
		</div>

		<div class="flex items-center md:items-end">
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

	{#if sortOptions.length > 0}
		<div class="flex flex-wrap gap-2 items-center">
			<span class="text-sm font-medium mr-2 dark:text-gray-300">Sorteer op:</span>
			{#each sortOptions as option (option.id)}
				<button
					class:active={option.id === currentSortId}
					class="sort-button p-1 px-3 border border-gray-300 dark:border-gray-700 rounded-md text-xs transition-colors duration-150 {option.id ===
					currentSortId
						? 'bg-blue-600 text-white font-semibold border-blue-600 dark:bg-blue-700 dark:border-blue-700'
						: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}"
					on:click={() => handleSortClick(option.id)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if displayedItems.length > 0}
	<div class="list-items-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
		{#each displayedItems as item (item.id)}
			<BoardGameCard game={item} />
		{/each}
	</div>
{:else}
	<div class="col-span-full text-center py-10">
		<p class="text-gray-500 dark:text-gray-400">
			Geen spellen gevonden die aan de filters voldoen.
		</p>
	</div>
{/if}

<style>
	/* Basis styling voor range inputs */
	.slider-range {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px; /* Hoogte van de track */
		background: #e5e7eb; /* Lichte track kleur */
		border-radius: 5px;
		outline: none;
		cursor: pointer;
		transition: background 0.2s ease-in-out;
	}
	:global(html.dark) .slider-range {
		background: #4b5563; /* Donkere track kleur */
	}

	.slider-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px; /* Grootte van de thumb */
		height: 16px;
		background: currentColor; /* Gebruikt accent-* kleur van parent */
		border-radius: 50%;
		cursor: pointer;
	}

	.slider-range::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: currentColor;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	/* Focus state wordt nu via Tailwind classes opgelost */
</style>
