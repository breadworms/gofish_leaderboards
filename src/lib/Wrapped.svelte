<script lang="ts">
    import type { Component } from "svelte";
    import type { Wrapped2025User } from "$lib";
    import ParticleOverlay from "$lib/ParticleOverlay.svelte";

    interface Props {
        data: Wrapped2025User;
        summaries: Record<string, Component<{ data: Wrapped2025User }>>;
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
