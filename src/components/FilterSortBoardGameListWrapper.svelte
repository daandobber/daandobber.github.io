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
