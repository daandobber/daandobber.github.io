<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import noUiSlider from "nouislider";
	import type { API as NoUiSliderAPI } from "nouislider";
	import "nouislider/dist/nouislider.css"; // Import default nouislider styles

	// --- Props ---
	export let label: string | undefined = undefined; // Optional label for the slider
	export let min: number = 0; // Overall minimum value
	export let max: number = 100; // Overall maximum value
	export let step: number = 1; // Step increment
	export let valueMin: number; // Bound minimum selected value (REQUIRED)
	export let valueMax: number; // Bound maximum selected value (REQUIRED)
	// Optional: add props for formatting, units etc. if needed later

	let sliderElement: HTMLDivElement; // Reference to the div where the slider will mount
	let sliderInstance: NoUiSliderAPI | null = null;

	// Internal state to prevent update loops when slider updates bound props
	let internalUpdate = false;

	onMount(() => {
		if (sliderElement) {
			sliderInstance = noUiSlider.create(sliderElement, {
				start: [valueMin, valueMax], // Initial handle positions
				connect: true, // Color the bar between handles
				step: step,
				range: {
					min: min,
					max: max,
				},
				// Optional: Add padding if handles shouldn't reach absolute min/max visually
				// padding: [0, 0],
				// Optional: Format numbers (e.g., for tooltips)
				format: {
					to: function (value) {
						// Display as integer by default
						return String(Math.round(value));
					},
					from: function (value) {
						return Number(value);
					},
				},
			});

			// Listen for slider updates
			sliderInstance.on("update", (values, handle, unencodedValues) => {
				const [newMin, newMax] = unencodedValues as [number, number];
				internalUpdate = true; // Signal that update comes from slider internal event
				valueMin = newMin;
				valueMax = newMax;
				// Reset flag after Svelte potentially processes update
				requestAnimationFrame(() => {
					internalUpdate = false;
				});
			});
		}

		return () => {
			// Cleanup on component destroy
			sliderInstance?.destroy();
		};
	});

	// --- Reactivity: Update slider if bound values change from parent ---
	// Check internalUpdate flag to avoid loop (slider updates -> props update -> slider updates again)
	$: if (sliderInstance && !internalUpdate && valueMin !== undefined && valueMax !== undefined) {
		// Get current slider values to avoid unnecessary updates
		const currentValues = sliderInstance.get(true) as [number, number];
		if (currentValues[0] !== valueMin || currentValues[1] !== valueMax) {
			sliderInstance.set([valueMin, valueMax]);
		}
	}
</script>

<div class="range-slider-wrapper space-y-1">
	{#if label}
		<span class="block text-sm font-medium dark:text-gray-300">{label}</span>
	{/if}
	<div class="flex items-center gap-2">
		<span class="text-xs w-8 text-right dark:text-gray-400 tabular-nums">
			{valueMin === undefined ? "..." : Math.round(valueMin)}
		</span>
		<div bind:this={sliderElement} class="nouislider-target flex-grow"></div>
		<span class="text-xs w-8 text-right dark:text-gray-400 tabular-nums">
			{valueMax === undefined
				? "..."
				: valueMax >= max
					? `${Math.round(max)}+`
					: Math.round(valueMax)}
		</span>
	</div>
</div>

<style>
	/* --- nouislider Styling Integration --- */
	/* Import the base CSS via JS import above */

	/* Target the specific slider instance within this component */
	.nouislider-target {
		height: 8px; /* Match height of original range inputs */
		/* You might need !important sometimes depending on CSS specificity */
	}

	/* Style the 'connect' bar using your global CSS variable */
	:global(.noUi-connect) {
		background: var(--color-accent, #3b82f6); /* Use accent color, fallback to blue */
	}

	/* Style the handles (knobs) */
	:global(.noUi-handle) {
		height: 16px !important;
		width: 16px !important;
		top: -4px !important; /* Adjust vertical position ( (track_height - handle_height) / 2 ) */
		right: -8px !important; /* Adjust horizontal position ( -handle_width / 2 ) */
		border-radius: 50% !important;
		background: var(--color-accent, #3b82f6) !important;
		border: none !important;
		box-shadow: none !important;
		cursor: pointer;
	}
	/* Remove the ::before and ::after pseudo-elements which create the default square look */
	:global(.noUi-handle::before),
	:global(.noUi-handle::after) {
		display: none;
	}

	/* Style the main bar background */
	:global(.noUi-target) {
		background: #e5e7eb; /* Light theme track */
		border: none;
		border-radius: 4px; /* Match track height / 2 */
		box-shadow: none;
	}
	:global(html.dark .noUi-target) {
		background: #4b5563; /* Dark theme track */
	}

	/* Optional: Add focus styling using Tailwind variables if possible,
       or define colors here using CSS vars */
	:global(.noUi-handle:focus) {
		/* Using outline directly might be simpler here than ring */
		outline: 2px solid var(--color-link, #3b82f6);
		outline-offset: 2px;
	}

	/* Prevent flexbox from shrinking the labels/values */
	span {
		flex-shrink: 0;
	}
	.tabular-nums {
		font-variant-numeric: tabular-nums; /* Keep numbers aligned */
	}
</style>
