<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { Release, SortOption, Artist } from '@/types';
	import RangeSlider from './ui/RangeSlider.svelte';
	import Select from 'svelte-select';
	// CSS import svelte-select hier weggelaten

	export let items: Release[] = [];
	export let searchFields: string[] = [];
	export let sortOptions: SortOption[] = [];
	export let initialSortId: string | null = sortOptions[0] ? sortOptions[0].id : null;
	export let sliderMinYear: number;
	export let sliderMaxYear: number;
	export let availableGenres: string[] = [];

	let searchTerm: string = '';
	let currentSortId: string | null = initialSortId;
	let minYear: number = sliderMinYear;
	let maxYear: number = sliderMaxYear;
	let viewMode: 'grid' | 'list' = 'grid';
	let selectedGenres: string[] = [];
	let selectedGenreObjects: { value: string; label: string }[] = [];
	$: selectedGenres = selectedGenreObjects?.map(obj => obj.value) ?? [];

	$: genreOptions = availableGenres.map(g => ({ value: g, label: g }));

	let debouncedSearchTerm: string = '';
	let debounceTimer: number;
	$: {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => {
			debouncedSearchTerm = searchTerm;
		}, 250);
	}
	onDestroy(() => { clearTimeout(debounceTimer); });

	function getProperty(obj: any, path: string): any {
		try {
			return path.split('.').reduce((o, k) => (o && o[k] !== undefined && o[k] !== null ? o[k] : null), obj);
		} catch (e) { return null; }
	}

	function formatArtistsForSort(artists: Artist[] | undefined): string {
		if (!artists || artists.length === 0) return 'zzzzzzz';
		return artists.map((artist: Artist) => artist.name).join(', ').toLowerCase();
	}

	$: activeSortOption = sortOptions.find((opt) => opt.id === currentSortId) || (sortOptions.length > 0 ? sortOptions[0] : undefined);

	$: displayedItems = computeDisplayedItems(
		items, debouncedSearchTerm, searchFields, activeSortOption, minYear, maxYear, selectedGenres
	);

	function computeDisplayedItems(
		originalItems: Release[], filterTerm: string, fieldsToSearch: string[],
		sortOption: SortOption | undefined, minY: number, maxY: number, selGenres: string[]
	): Release[] {
		const lowerFilterTerm = filterTerm.toLowerCase().trim();

		let filtered = originalItems.filter((item: Release) => {
			if (lowerFilterTerm) {
				const isMatch = fieldsToSearch.some((fieldPath) => {
                    const value = getProperty(item, fieldPath);
					if (fieldPath.includes('artists.name')) {
                        const artists = getProperty(item, 'basic_information.artists');
						return Array.isArray(artists) && artists.some(a => a.name?.toLowerCase().includes(lowerFilterTerm));
                    } else if (typeof value === 'string') {
                        return value.toLowerCase().includes(lowerFilterTerm);
                    } else if (typeof value === 'number') {
                         return String(value).includes(lowerFilterTerm);
                    }
					return false;
				});
				if (!isMatch) return false;
			}

            const itemYear = item.basic_information?.year;
            if (itemYear && itemYear > 0) {
                if (itemYear < minY || itemYear > maxY) { return false; }
            } else {
                 if (minY > sliderMinYear || maxY < sliderMaxYear) { return false; }
            }

			if (selGenres.length > 0) {
                if (!selGenres.every((genre) => item.basic_information?.genres?.includes(genre))) { return false; }
            }

			return true;
		});

		if (sortOption) {
			const { sortKey, order } = sortOption;
			const sortOrder = order === 'asc' ? 1 : -1;
			filtered.sort((a: Release, b: Release) => {
				let valA: string | number; let valB: string | number;
				switch (sortKey) {
					case 'artist':
						valA = formatArtistsForSort(a.basic_information?.artists);
						valB = formatArtistsForSort(b.basic_information?.artists);
						break;
					case 'year':
						valA = a.basic_information?.year ?? (order === 'asc' ? 9999 : 0);
						valB = b.basic_information?.year ?? (order === 'asc' ? 9999 : 0);
						break;
					case 'title':
						valA = getProperty(a, 'basic_information.title') || '';
						valB = getProperty(b, 'basic_information.title') || '';
						break;
					default: valA = 0; valB = 0;
				}
				let comparison = 0;
				if (typeof valA === 'string' && typeof valB === 'string') { comparison = valA.localeCompare(valB); }
                else { if (valA < valB) comparison = -1; if (valA > valB) comparison = 1; }
				if (comparison === 0 && sortKey !== 'title') {
					const titleA = getProperty(a, 'basic_information.title') || '';
					const titleB = getProperty(b, 'basic_information.title') || '';
					return titleA.localeCompare(titleB);
				}
				return comparison * sortOrder;
			});
		}
		return filtered;
	}

	function setViewMode(mode: 'grid' | 'list') { viewMode = mode; }

</script>

<div class="filter-sort-list-container mb-8 space-y-6">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
        <div>
            <label for="cd-filter-input" class="block text-sm font-medium mb-1 dark:text-gray-300">Zoeken</label>
            <input type="text" id="cd-filter-input" placeholder="Filter op titel of artiest..."
                class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                bind:value={searchTerm} />
        </div>
         {#if sortOptions.length > 0}
            <div>
                <label for="cd-sort-select" class="block text-sm font-medium mb-1 dark:text-gray-300">Sorteer op:</label>
                <select id="cd-sort-select" bind:value={currentSortId}
                    class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {#each sortOptions as option (option.id)} <option value={option.id}>{option.label}</option> {/each}
                </select>
            </div>
        {/if}
    </div>

     <div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
         <RangeSlider label="Jaartal" min={sliderMinYear} max={sliderMaxYear} step={1}
            bind:valueMin={minYear} bind:valueMax={maxYear} />

          <div>
            <label for="cd-genres" class="block text-sm font-medium mb-1 dark:text-gray-300">Genres</label>
            <Select id="cd-genres" items={genreOptions} bind:value={selectedGenreObjects} multiple={true}
                placeholder="Selecteer genres..." --item-text-color="var(--color-global-text)"
                --item-bg="var(--color-global-bg)" --item-hover-bg="rgba(128, 128, 128, 0.2)"
                --input-text-color="var(--color-global-text)" --input-placeholder-color="rgba(128, 128, 128, 0.7)"
                --multi-item-bg="var(--color-accent)" --multi-item-color="#FFF" --border-radius="0.375rem"
                --border="1px solid #D1D5DB" --hover-border="1px solid #9CA3AF" --focus-box-shadow="0 0 0 2px var(--color-link)" />
        </div>
     </div>

    <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div></div>
        <div class="flex gap-1">
            <button title="Grid View" on:click={() => setViewMode('grid')}
                aria-label="Grid Weergave"
                class:active={viewMode === 'grid'} aria-pressed={viewMode === 'grid'}
                class="p-1 border rounded {viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clip-rule="evenodd" /></svg>
            </button>
            <button title="List View" on:click={() => setViewMode('list')}
                aria-label="Lijst Weergave"
                class:active={viewMode === 'list'} aria-pressed={viewMode === 'list'}
                class="p-1 border rounded {viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5A.75.75 0 0 1 2.75 14h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 14.75Z" clip-rule="evenodd" /></svg>
            </button>
        </div>
    </div>
</div>

<div class="list-items-container gap-4"
    class:grid={viewMode === 'grid'} class:grid-cols-2={viewMode === 'grid'}
    class:sm:grid-cols-3={viewMode === 'grid'} class:md:grid-cols-4={viewMode === 'grid'}
    class:md:gap-6={viewMode === 'grid'} class:flex={viewMode === 'list'}
    class:flex-col={viewMode === 'list'} >
    {#each displayedItems as item (item.id)}
        <slot name="item" {item} view={viewMode}></slot>
    {:else}
        <div class="col-span-full">
            <slot name="no-results">
                <p class="mt-6 text-center text-gray-500 dark:text-gray-400">Geen items gevonden.</p>
            </slot>
        </div>
    {/each}
</div>

<style>
     :global(html[data-theme="dark"] .svelte-select-list) { background-color: #374151; border-color: #4b5563; }
     :global(html[data-theme="dark"] .svelte-select-item.hover) { background-color: #4b5563; }
     :global(html[data-theme="dark"] .svelte-select-input) { color: #e5e7eb; }
     :global(html[data-theme="dark"] .svelte-select .input-container) { --border: 1px solid #4b5563; }
</style>