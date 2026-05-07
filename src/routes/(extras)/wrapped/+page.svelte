<script lang="ts">
    import "../../../extras.css";
    import { page } from "$app/state";
    import Meta from "$lib/Meta.svelte";
    import Wrapped from "$lib/extras/Wrapped.svelte";
    import IntroductionSummary from "$lib/extras/IntroductionSummary.svelte";
    import SizeSummary from "$lib/extras/SizeSummary.svelte";
    import FrequencySummary from "$lib/extras/FrequencySummary.svelte";
    import RaritySummary from "$lib/extras/RaritySummary.svelte";
    import GeneralSummary from "$lib/extras/GeneralSummary.svelte";
    import ClosingSummary from "$lib/extras/ClosingSummary.svelte";
    import { fishToImage, type Wrapped2025User } from "$lib";

    async function getData() {
        const id = page.url.searchParams.get("id");
        const res = await fetch(`/wrappeds_2025/${id}.json`);

        if (!res.ok) {
            throw new Error(res.status.toString());
        }

        const raw = await res.json();

        const data = {
            name: raw["Name"] as string,
            startDate: (new Date(`${raw["Year"]}-04-20`)).getTime(),
            endDate: (new Date(`${Number(raw["Year"]) + 1}-04-20`)).getTime(),
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
                fish: fishToImage(rawSize["Fish"]),
                weight: rawSize["Weight in lbs"],
                catchType: rawSize["Catchtype"].toLowerCase(),
                catchDate: (new Date(rawSize["Date"])).getTime(),
                rank: rawSize["Rank"],
                rankAllTime: rawSize["RankAllTime"]
            })),
            frequencyTopFive: (raw["MostCaughtFish"] as any[]).map(rawFrequency => ({
                fish: fishToImage(rawFrequency["Fish"]),
                count: rawFrequency["Count"]
            })),
            rarityTopFive: (raw["RarestFish"] as any[]).map(rawRarest => ({
                fish: fishToImage(rawRarest["Fish"]),
                countGlobal: rawRarest["CountYear"],
                countGlobalAllTime: rawRarest["CountAllTime"]
            }))
        } as Wrapped2025User;

        return data;
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
