<script lang="ts">
    import type { Component } from "svelte";
    import ParticleOverlay from "$lib/ParticleOverlay.svelte";

    export interface WrappedUser {
        name: string;
        startDate: Date;
        endDate: Date;
        fishSeenCount: number;
        fishSeenPercentile: number;
        caughtCount: number;
        caughtPercentile: number;
        chats: {
            chat: string;
            caughtCount: number;
            caughtPercentile: number;
            timeSpentPercentage: number;
        }[];
        locations: {
            location: "acornpond" | "big" | "docks",
            missCount: number,
            missPercentile: number,
            timeSpentPercentage: number,
            weather: {
                ambiance: string,
                timeSpentPercentage: number
            }[]
        }[];
        sizeTopFive: {
            image: string,
            weight: number,
            catchType: "normal",
            catchDate: Date,
            rank: number,
            rankAllTime: number
        }[];
        frequencyTopFive: {
            image: string,
            count: number
        }[];
        rarityTopFive: {
            image: string,
            countGlobal: number,
            countGlobalAllTime: number
        }[];
    }

    interface Props {
        data: WrappedUser;
        summaries: Record<string, Component<{ data: WrappedUser }>>;
    }

    let { data, summaries }: Props = $props();
    let particles: ParticleOverlay;
</script>

<ParticleOverlay
    bind:this={particles}
    bubbleImages={Array.from({ length: 6 }, (_, i) => `/bubble${i + 1}.png`)}
/>

<div class="h-screen snap-y snap-mandatory overflow-y-scroll" onscroll={() => particles.burst()}>
    {#each Object.entries(summaries) as [id, Summary]}
        <div {id} class="h-screen p-4 snap-start flex flex-col items-center justify-center">
            <Summary {data} />
        </div>
    {/each}
</div>

<style lang="postcss">
    @reference "tailwindcss";
</style>
