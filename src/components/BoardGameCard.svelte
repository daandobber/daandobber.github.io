<script lang="ts">
    import type { BoardGame } from "@/types";

    export let game: BoardGame | undefined | null;

    // Helper functie voor spelersaantal weergave
    function formatPlayers(min: number | null, max: number | null): string {
        if (min && max) {
            return min === max ? `${min}` : `${min}-${max}`;
        } else if (min) {
            return `${min}+`;
        } else if (max) {
            // Aangepast: Als alleen max bekend is, is min meestal >= 1
            return `1-${max}`;
        }
        return "N/A";
    }

    // Helper functie voor speeltijd weergave
    function formatPlaytime(min: number | null, max: number | null, avg: number | null): string {
        if (min && max && max > min) { // Geef voorkeur aan range als die significant is
            return `${min}-${max} min`;
        } else if (avg && avg > 0) {
             return `${avg} min`;
        } else if (max && max > 0) { // Fallback op max
             return `${max} min`;
        } else if (min && min > 0) { // Fallback op min
             return `${min} min`;
        }
        return "N/A";
    }

    // Helper voor gewicht
    function formatWeight(weight: number | null): string {
        return weight ? weight.toFixed(2) : "N/A";
    }

    // --- Afgeleide Variabelen voor Weergave (binnen #if game context) ---
    // We kunnen hier veilig game.property gebruiken ipv game?.property
    // omdat de template omgeven is door {#if game}.
    // Gebruik ?? null als extra vangnet voor het geval een property *echt* zou ontbreken.
    const name = game?.name ?? "Geen Naam"; // game?.name mag hier nog wel voor de zekerheid
    const year = game?.yearpublished;
    const placeholderImg = "/images/placeholder-cover.png";
    const thumbnail = game?.thumbnail ?? placeholderImg;
    const altText = `Cover van ${name}`;
    const bggLink = `https://boardgamegeek.com/boardgame/${game?.id ?? ''}`;

    // Roep helpers aan met gegarandeerd 'number | null' (of 'string | null' voor best_with_players)
    const players = formatPlayers(game?.minplayers ?? null, game?.maxplayers ?? null);
    const playtime = formatPlaytime(game?.minplaytime ?? null, game?.maxplaytime ?? null, game?.playingtime ?? null);
    const weightFormatted = formatWeight(game?.weight ?? null); // Renamed
    const bestWith = game?.best_with_players ? `Best: ${game.best_with_players}` : "";
    const averageRating = game?.average_rating ? game.average_rating.toFixed(1) : null; // Rond BGG rating af

</script>

{#if game}
<a
    href={bggLink}
    target="_blank"
    rel="noopener noreferrer"
    class="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    aria-label={`Bekijk ${name} op BoardGameGeek`}
>
    <div class="aspect-square w-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
        <img
            src={thumbnail}
            alt={altText}
            class="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            loading="lazy"
            width="200" height="200"
            on:error={(e: Event) => { // <-- Type 'Event' toegevoegd aan 'e'
                const target = e.target as HTMLImageElement; // Cast target naar HTMLImageElement
                if (target) {
                    target.src = placeholderImg;
                }
            }}
        />
    </div>
    <div class="flex flex-grow flex-col p-3">
        <h2 class="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100" title={name}>
            {name}
        </h2>
        {#if year}
             <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{year}</p>
        {/if}

         <div class="mt-auto pt-2 text-xs space-y-1 text-gray-700 dark:text-gray-300">
             <div class="flex justify-between items-center gap-2" title={`Spelers: ${players}`}>
                 <span class="flex items-center gap-1">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.409-1.412A7.957 7.957 0 0 0 10 14a7.957 7.957 0 0 0-6.535.493Z" /></svg>
                     <span>{players}</span>
                 </span>
                 {#if bestWith}
                    <span class="font-medium text-green-700 dark:text-green-400" title="Aanbevolen spelersaantal">{bestWith}</span>
                 {/if}
             </div>
             <div class="flex items-center gap-1" title={`Speelduur: ${playtime}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" /></svg>
                  <span>{playtime}</span>
             </div>
             <div class="flex items-center gap-1" title={`Complexiteit: ${weightFormatted} / 5`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M15.988 3.112a.75.75 0 0 1 .393 1.288l-3.74 2.244a5.503 5.503 0 0 1 1.1 1.86l3.74-2.244a.75.75 0 1 1 .786 1.31l-3.74 2.244c.266.486.468 1 .59 1.538l3.74-2.244a.75.75 0 1 1 .786 1.31l-3.74 2.244a5.507 5.507 0 0 1-1.636 5.818.75.75 0 1 1-1.158-.943 4.007 4.007 0 0 0 1.19-4.246l-3.74 2.244a.75.75 0 1 1-.786-1.31l3.74-2.244a5.506 5.506 0 0 1-.59-1.538l-3.74 2.244a.75.75 0 1 1-.786-1.31l3.74-2.244a5.506 5.506 0 0 1-1.1-1.86L4.8 8.402a.75.75 0 1 1-.786-1.31l3.74-2.244a4.007 4.007 0 0 0-1.19 4.246.75.75 0 1 1-1.158.943 5.507 5.507 0 0 1 1.636-5.818l3.74-2.244a.75.75 0 1 1 .786-1.31L9.41 6.316a5.506 5.506 0 0 1 .59 1.538l3.74-2.244a.75.75 0 0 1 1.288-.393Z" clip-rule="evenodd" /></svg>
                  {/* Gebruik de geformatteerde variabele */}
                  <span>{weightFormatted} / 5</span>
             </div>
             {#if averageRating} {/* Check op de afgeleide variabele */}
                  <div class="flex items-center gap-1" title={`Gemiddelde BGG rating: ${averageRating}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-amber-500"><path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.11a.75.75 0 0 0 .411 1.286l4.862 1.041 1.892 4.575a.75.75 0 0 0 1.358 0l1.892-4.575 4.862-1.041a.75.75 0 0 0 .411-1.286l-3.423-3.11-4.753-.39-1.83-4.401Z" clip-rule="evenodd" /></svg>
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
        /* Standaard property voor compatibility */
        line-clamp: 2;
    }
    a {
         text-decoration: none;
         color: inherit;
    }
</style>