<script lang="ts">
	import FilterSortList from "@/components/FilterSortList.svelte";
	import CDCard from "@/components/CDCard.astro";
	import type { Release, SortOption } from "@/types";

	// Definieer de props van de wrapper
	export let items: Release[] = [];
	export let searchFields: string[] = [];
	export let sortOptions: SortOption[] = [];
	export let initialSortId: string | null = null;
</script>

<FilterSortList {items} {searchFields} {sortOptions} {initialSortId}>
	<svelte:fragment slot="item" let:item>
		{#if item}
			<CDCard release={item as Release} />
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="no-results">
		<p class="col-span-full mt-6 text-center text-gray-500 dark:text-gray-400">
			Helaas, geen CD's gevonden die voldoen aan je filter.
		</p>
	</svelte:fragment>
</FilterSortList>
