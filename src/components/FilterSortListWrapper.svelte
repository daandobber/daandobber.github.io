<script lang="ts">
    import FilterSortList from "@/components/FilterSortList.svelte";
    import CDCard from "@/components/CDCard.svelte";
    import type { Release, SortOption } from "@/types";

    export let items: Release[] = [];
    export let searchFields: string[] = [];
    export let sortOptions: SortOption[] = [];
    export let initialSortId: string | null = null;
    export let sliderMinYear: number = 1900;
    export let sliderMaxYear: number = new Date().getFullYear();
    export let availableGenres: string[] = [];
</script>

<FilterSortList
    {items}
    {searchFields}
    {sortOptions}
    {initialSortId}
    {sliderMinYear}
    {sliderMaxYear}
    {availableGenres}
>
    <svelte:fragment slot="item" let:item let:view>
        {#if item}
            <CDCard release={item as Release} view={view} />
        {/if}
    </svelte:fragment>
    <svelte:fragment slot="no-results">
        <p class="col-span-full mt-6 text-center text-gray-500 dark:text-gray-400">
            Helaas, geen CD's gevonden die voldoen aan je filter.
        </p>
    </svelte:fragment>
</FilterSortList>