<script lang="ts">
	import type { SteamGame } from "@/types";
	import { parse, format } from "date-fns";
	// import { nl } from 'date-fns/locale'; // Deze is verwijderd

	export let view: "grid" | "list" = "grid";
	export let game: SteamGame | undefined | null;

	const placeholderImg = "/images/placeholder-steam.png";
	const imageToShow = game?.image ?? game?.thumbnail ?? placeholderImg;
	const smallImage = game?.thumbnail ?? game?.image ?? placeholderImg;
	const altText = `Cover van ${game?.name ?? "onbekend spel"}`;
	const steamLink = game?.id ? `https://store.steampowered.com/app/${game.id}` : "#";

	let releaseYear: string | null = null;
	if (game?.release_date) {
		try {
			const yearMatch = game.release_date.match(/\b\d{4}\b/);
			if (yearMatch) {
				releaseYear = yearMatch[0];
			} else {
				const parsedDate = parse(game.release_date, "yyyy", new Date());
				if (!isNaN(parsedDate.getTime())) releaseYear = format(parsedDate, "yyyy");
			}
		} catch (e) {}
	}

	const developers = game?.developers?.join(", ");
	const publishers = game?.publishers?.join(", ");
	const genres = game?.genres?.slice(0, 2).join(", ");
	const categories = game?.categories?.slice(0, 2).join(", ");
</script>

{#if game}
	{#if view === "grid"}
		<a
			href={steamLink}
			target="_blank"
			rel="noopener noreferrer"
			class="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
		>
			<div class="aspect-video w-full flex-shrink-0 overflow-hidden bg-gray-700">
				<img
					src={imageToShow}
					alt={altText}
					loading="lazy"
					width="460"
					height="215"
					class="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
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
					title={game.name}
				>
					{game.name}
				</h2>
				<div
					class="mt-auto flex items-center justify-between pt-1 text-xs text-gray-500 dark:text-gray-400"
				>
					<span>{releaseYear ?? ""}</span>
					{#if game.metacritic_score}
						<span
							class="inline-flex items-center rounded border border-green-400 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:border-green-600 dark:text-green-300"
						>
							{game.metacritic_score}
						</span>
					{/if}
				</div>
			</div>
		</a>
	{:else}
		<a
			href={steamLink}
			target="_blank"
			rel="noopener noreferrer"
			class="group grid h-full grid-cols-[auto_1fr] items-center gap-x-3 overflow-hidden rounded-lg border border-gray-300 bg-white p-2 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
		>
			<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-700">
				<img
					src={smallImage}
					alt={altText}
					loading="lazy"
					width="40"
					height="40"
					class="h-full w-full object-cover"
					on:error={(e: Event) => {
						const target = e.target as HTMLImageElement;
						if (target) {
							target.src = placeholderImg;
						}
					}}
				/>
			</div>
			<div class="min-w-0 text-xs">
				<div class="flex items-baseline justify-between gap-2">
					<h2 class="truncate font-semibold text-gray-900 dark:text-gray-100" title={game.name}>
						{game.name}
					</h2>
					{#if game.metacritic_score}
						<span
							class="flex-shrink-0 inline-flex items-center rounded border border-green-400 px-1 py-0 text-[10px] font-medium text-green-700 dark:border-green-600 dark:text-green-300"
						>
							{game.metacritic_score}
						</span>
					{/if}
				</div>
				<div class="mt-0.5 flex flex-wrap items-center gap-x-2 text-gray-500 dark:text-gray-400">
					{#if releaseYear}<span class="whitespace-nowrap">{releaseYear}</span>{/if}
					{#if developers}<span class="truncate whitespace-nowrap" title={developers}
							>&bull; {developers}</span
						>{/if}
					{#if publishers}<span class="truncate whitespace-nowrap" title={publishers}
							>&bull; {publishers}</span
						>{/if}
				</div>
				{#if genres || categories}
					<div
						class="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-400 dark:text-gray-500"
					>
						{#if genres}<span class="truncate" title={genres}>{genres}</span>{/if}
						{#if categories && genres}<span>&bull;</span>{/if}
						{#if categories}<span class="truncate" title={categories}>{categories}</span>{/if}
					</div>
				{/if}
			</div>
		</a>
	{/if}
{/if}

<style>
	.line-clamp-2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
</style>
