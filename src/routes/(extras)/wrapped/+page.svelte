<script lang="ts">
    import "../../../extras.css";
    import { page } from "$app/state";
    import Meta from "$lib/Meta.svelte";
    import type { WrappedUser } from "$lib/2025/preprocess";
    import Wrapped from "$lib/2025/Wrapped.svelte";
    import IntroductionSummary from "$lib/2025/IntroductionSummary.svelte";
    import SizeSummary from "$lib/2025/SizeSummary.svelte";
    import FrequencySummary from "$lib/2025/FrequencySummary.svelte";
    import RaritySummary from "$lib/2025/RaritySummary.svelte";
    import GeneralSummary from "$lib/2025/GeneralSummary.svelte";
    import ClosingSummary from "$lib/2025/ClosingSummary.svelte";
    import { dev } from "$app/environment";

    async function getData(): Promise<WrappedUser> {
        const id = page.url.searchParams.get("id");
        const res = await fetch(`https://data.gofish.lol/wrapped/2025/${id}.json`);

        if (!res.ok) {
            throw new Error(res.status.toString());
        }

        return res.json();
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
{:catch e}
    {#if dev}
        <div class="text-red-400">{e}</div>
    {:else}
        <div>No user found.</div>
    {/if}
{/await}
