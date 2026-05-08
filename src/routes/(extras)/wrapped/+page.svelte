<script lang="ts">
    import "../../../extras.css";
    import { page } from "$app/state";
    import Meta from "$lib/Meta.svelte";
    import Wrapped from "$lib/Wrapped.svelte";
    import IntroductionSummary from "$lib/IntroductionSummary.svelte";
    import SizeSummary from "$lib/SizeSummary.svelte";
    import FrequencySummary from "$lib/FrequencySummary.svelte";
    import RaritySummary from "$lib/RaritySummary.svelte";
    import GeneralSummary from "$lib/GeneralSummary.svelte";
    import ClosingSummary from "$lib/ClosingSummary.svelte";
    import type { Wrapped2025User } from "$lib";
    import twemoji from "@twemoji/api";

    // mimic twemoji img tags here (kinda dumb)
    const shinies: Record<string, string> = {
        "DarkMode": `<img class="fish" draggable="false" alt="DarkMode" src="https://static-cdn.jtvnw.net/emoticons/v2/461298/default/dark/3.0" />`,
        "SabaPing": `<img class="fish" draggable="false" alt="SabaPing" src="https://static-cdn.jtvnw.net/emoticons/v2/160402/default/dark/3.0" />`,
        "OSFrog": `<img class="fish" draggable="false" alt="OSFrog" src="https://static-cdn.jtvnw.net/emoticons/v2/81248/default/dark/3.0" />`,
        "HailHelix": `<img class="fish" draggable="false" alt="HailHelix" src="https://cdn.betterttv.net/emote/54fa90f201e468494b85b545/3x.webp" />`
    };

    function fishToImage(fish: string) {
        const emote = fish.split(" ")[0];

        return shinies.hasOwnProperty(emote)
            ? shinies[emote]
            : twemoji.parse(emote, { className: "fish" });
    }

    async function getData() {
        const id = page.url.searchParams.get("id");
        const res = await fetch(`/wrappeds_2025/${id}.json`);

        if (!res.ok) {
            throw new Error(res.status.toString());
        }

        const raw = await res.json();

        return {
            name: raw["Name"] as string,
            startDate: new Date(`${raw["Year"]}-04-20 00:00:00 UTC`),
            endDate: new Date(`${Number(raw["Year"]) + 1}-04-20 00:00:00 UTC`),
            fishSeenCount: raw["FishSeenCount"],
            fishSeenPercentile: Math.round(100 - raw["FishSeenPercentile"]),
            caughtCount: raw["Count"]["Total"],
            caughtPercentile: Math.round(100 - raw["Count"]["Percentile"]),
            chats: Object.entries(raw["Count"]["ChatCounts"]).map(([chat, rawChat]: [string, any]) => ({
                chat,
                caughtCount: rawChat["Total"],
                caughtPercentile: Math.round(100 - rawChat["Percentile"]),
                timeSpentPercentage: Math.round(rawChat["Percentage"])
            })).sort((a, b) => b.caughtCount - a.caughtCount),
            locations: Object.entries(raw["FishLocations"]).map(([location, rawLocation]: [string, any]) => ({
                location,
                missCount: rawLocation["Count"],
                missPercentile: Math.round(100 - rawLocation["Percentile"]),
                timeSpentPercentage: Math.round(rawLocation["Percentage"]),
                weather: (rawLocation["Ambiences"] as any[]).map(rawWeather => ({
                    ambiance: rawWeather["Ambience"],
                    timeSpentPercentage: Math.round(rawWeather["Percentage"])
                })).sort((a, b) => b.timeSpentPercentage - a.timeSpentPercentage)
            })).sort((a, b) => b.missCount - a.missCount),
            sizeTopFive: (raw["BiggestFish"] as any[]).map(rawSize => ({
                image: fishToImage(rawSize["Fish"]),
                weight: rawSize["Weight in lbs"],
                catchType: rawSize["Catchtype"].toLowerCase(),
                catchDate: new Date(rawSize["Date"]),
                rank: rawSize["Rank"],
                rankAllTime: rawSize["RankAllTime"]
            })),
            frequencyTopFive: (raw["MostCaughtFish"] as any[]).map(rawFrequency => ({
                image: fishToImage(rawFrequency["Fish"]),
                count: rawFrequency["Count"]
            })),
            rarityTopFive: (raw["RarestFish"] as any[]).map(rawRarest => ({
                image: fishToImage(rawRarest["Fish"]),
                countGlobal: rawRarest["CountYear"],
                countGlobalAllTime: rawRarest["CountAllTime"]
            }))
        } as Wrapped2025User;
    }
</script>

<Meta
    title="gofish 🫧 wrapped"
    description="Your gofish wrapped"
/>

<svelte:head>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#await getData()}
    <div>Loading...</div>
{:then data}
    <Wrapped {data} summaries={{
        introduction: IntroductionSummary,
        size: SizeSummary,
        frequency: FrequencySummary,
        rarity: RaritySummary,
        general: GeneralSummary,
        closing: ClosingSummary
    }} />
{:catch}
    <div>No user found.</div>
{/await}
