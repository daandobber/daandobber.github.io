<script lang="ts">
	import type { BoardGame } from "@/types";

	export let game: BoardGame | undefined | null;

	function formatPlayers(min: number | null, max: number | null): string {
		if (min && max) {
			return min === max ? `${min}` : `${min}-${max}`;
		} else if (min) {
			return `${min}+`;
		} else if (max) {
			return `1-${max}`;
		}
		return "N/A";
	}

	function formatPlaytime(min: number | null, max: number | null, avg: number | null): string {
		if (min && max && max > min) {
			return `${min}-${max} min`;
		} else if (avg && avg > 0) {
			return `${avg} min`;
		} else if (max && max > 0) {
			return `${max} min`;
		} else if (min && min > 0) {
			return `${min} min`;
		}
		return "N/A";
	}

	function formatWeight(weight: number | null): string {
		return weight ? weight.toFixed(2) : "N/A";
	}

	const name = game?.name ?? "Geen Naam";
	const year = game?.yearpublished;
	const placeholderImg = "/images/placeholder-cover.png";
	const thumbnail = game?.thumbnail ?? placeholderImg;
	const altText = `Cover van ${name}`;
	const bggLink = `https://boardgamegeek.com/boardgame/${game?.id ?? ""}`;

	const players = formatPlayers(game?.minplayers ?? null, game?.maxplayers ?? null);
	const playtime = formatPlaytime(
		game?.minplaytime ?? null,
		game?.maxplaytime ?? null,
		game?.playingtime ?? null,
	);
	const weightFormatted = formatWeight(game?.weight ?? null);
	const bestWith = game?.best_with_players ? `Best: ${game.best_with_players}` : "";
	const averageRating = game?.average_rating ? game.average_rating.toFixed(1) : null;
</script>

{#if game}
	<a
		href={bggLink}
		target="_blank"
		rel="noopener noreferrer"
		class="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
		aria-label={`Bekijk ${name} op BoardGameGeek`}
	>
		<div class="aspect-square w-full overflow-hidden bg-gray-200 dark:bg-gray-600">
			<img
				src={thumbnail}
				alt={altText}
				class="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
				loading="lazy"
				width="200"
				height="200"
				on:error={(e: Event) => {
					const target = e.target as HTMLImageElement;
					if (target) {
						target.src = placeholderImg;
					}
				}}
			/>
		</div>
		<div class="flex flex-grow flex-col p-3">
			<h2
				class="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100"
				title={name}
			>
				{name}
			</h2>
			{#if year}
				<p class="mb-2 text-xs text-gray-500 dark:text-gray-400">{year}</p>
			{/if}

			<div class="mt-auto space-y-1 pt-2 text-xs text-gray-700 dark:text-gray-300">
				<div class="flex items-center justify-between gap-2" title={`Spelers: ${players}`}>
					<span class="flex items-center gap-1">
						<span class="inline-block w-3 text-center">👥</span>
						<span>{players}</span>
					</span>
					{#if bestWith}
						<span
							class="font-medium text-green-700 dark:text-green-400"
							title="Aanbevolen spelersaantal">{bestWith}</span
						>
					{/if}
				</div>
				<div class="flex items-center gap-1" title={`Speelduur: ${playtime}`}>
					<span class="inline-block w-3 text-center">⏳</span>
					<span>{playtime}</span>
				</div>
				<div class="flex items-center gap-1" title={`Complexiteit: ${weightFormatted} / 5`}>
					<span class="inline-block w-3 text-center">⚖️</span>
					<span>{weightFormatted} / 5</span>
				</div>
				{#if averageRating}
					<div class="flex items-center gap-1" title={`Gemiddelde BGG rating: ${averageRating}`}>
						<span class="inline-block w-3 text-center">⭐</span>
						<span>{averageRating}</span>
					</div>
				{/if}
			</div>
		</div>
	</a>
{/if}

<style>
	.line-clamp-2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
