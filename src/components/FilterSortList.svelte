<script>
  import { onDestroy } from 'svelte';

  // --- Props (Inputs for the component) ---
  export let items = []; // The array of data items (CDs, games, etc.)
  export let searchFields = []; // Array of paths to search in, e.g., ['title', 'artist.name']
  export let sortOptions = []; // Array of sort configurations
  export let initialSortId = sortOptions.length > 0 ? sortOptions[0].id : null; // Default sort

  // --- Internal State ---
  let searchTerm = '';
  let currentSortId = initialSortId;

  // --- Helper Functions ---

  // Safely get potentially nested property value from an object based on a path string
  // Basic version: handles dot notation like 'basic_information.title'
  // Doesn't handle arrays like 'artists[].name' directly - use valueFn for that
  function getProperty(obj, path) {
    try {
      return path.split('.').reduce((o, k) => (o && o[k] !== undefined && o[k] !== null) ? o[k] : null, obj);
    } catch (e) {
      return null; // Return null if path is invalid or object is weird
    }
  }

  // Get the currently active sort option object
  $: activeSortOption = sortOptions.find(opt => opt.id === currentSortId) || sortOptions[0];

  // --- Derived State: The magic! This updates automatically when props or state change ---
  $: displayedItems = (() => {
    // 1. Filter based on searchTerm
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    let filtered = items.filter(item => {
      if (!lowerSearchTerm) return true; // Show all if no search term

      // Check against all specified search fields
      return searchFields.some(fieldPath => {
        const value = getProperty(item, fieldPath);
        // If value is an array (like artists), we might need specific handling
        // For now, simple check if it's a string and includes the term
        // A more robust solution might involve passing search value extractors
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerSearchTerm);
        }
        // Add more checks if needed (e.g., for arrays) or rely on valueFn concept
         if (fieldPath.includes('artists')) { // Specific hack for artists array
             const artists = getProperty(item, 'basic_information.artists');
             if (Array.isArray(artists)) {
                 return artists.some(a => a.name?.toLowerCase().includes(lowerSearchTerm));
             }
         }
        return false;
      });
    });

    // 2. Sort the filtered items
    if (activeSortOption) {
      const { valueFn, order } = activeSortOption; // Get value extractor and order
      const sortOrder = order === 'asc' ? 1 : -1;

      filtered.sort((a, b) => {
        const valA = valueFn(a); // Use the function passed from parent to get sort value
        const valB = valueFn(b);

        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB); // Use localeCompare for strings
        } else {
          // Basic comparison for numbers or other types
          if (valA < valB) comparison = -1;
          if (valA > valB) comparison = 1;
        }

        // If primary sort values are equal, add secondary sort (e.g., by title)
        if (comparison === 0) {
           const titleA = getProperty(a, 'basic_information.title') || '';
           const titleB = getProperty(b, 'basic_information.title') || '';
           return titleA.localeCompare(titleB); // Secondary sort A-Z title
        }


        return comparison * sortOrder;
      });
    }

    return filtered;
  })(); // Immediately invoke the function to assign value

  // --- Event Handlers ---
  function handleSortClick(id) {
    currentSortId = id;
  }

  // Debounce for search input
  let debounceTimer;
  function handleInput(event) {
    clearTimeout(debounceTimer);
    const value = event.target.value;
    debounceTimer = setTimeout(() => {
      searchTerm = value;
    }, 250); // 250ms delay
  }

  // Cleanup debounce timer when component is destroyed
  onDestroy(() => {
    clearTimeout(debounceTimer);
  });

</script>

<div class="filter-sort-list-container">
  <div class="mb-4">
    <label for="filter-input-{initialSortId}" class="sr-only">Filter collectie</label> {# Unique ID using prop #}
    <input
      type="text"
      id="filter-input-{initialSortId}"
      placeholder="Filter..."
      class="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={searchTerm}
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
    {#each displayedItems as item (item.id || JSON.stringify(item))} {# Use item.id if available, fallback for key #}
      <slot name="item" item={item}></slot>
    {:else}
      <div class="col-span-full"> {# Ensure it spans all columns #}
        <slot name="no-results">
          <p class="mt-6 text-center text-gray-500 dark:text-gray-400">
            Geen items gevonden.
          </p>
        </slot>
      </div>
    {/each}
  </div>

</div>

<style>
  .sort-button.active {
    /* Tailwind classes handle most styling, add overrides here if needed */
    /* Example: border-color: theme('colors.blue.500'); */
  }
  /* Add other component-specific styles here */
</style>