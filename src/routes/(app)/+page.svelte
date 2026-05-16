<script lang="ts">
    import { replaceState } from "$app/navigation";
    import { page } from "$app/state";
    import Leaderboards from "$lib/Leaderboards.svelte";
    import Meta from "$lib/Meta.svelte";
    import { onMount } from "svelte";

    let selected = $state("global");
    let loaded = $state(false);

    onMount(() => {
        const params = new URLSearchParams(location.search);
        selected = params.get("channel")
            ?? localStorage.getItem("channel")
            ?? selected;
        loaded = true;
    });

    function selectChannel(this: HTMLSelectElement) {
        let url = new URL(location.href);
        let search = new URLSearchParams(location.search);
        search.set("channel", this.value);
        url.search = search.toString();
        replaceState(url, page.state);

        localStorage.setItem("channel", this.value);
    }

    /** only those which have individual leadeboards */
    const channels = [
        "global",
        "aquaismissing",
        "breadworms",
        "coolishdanker",
        "d_egree",
        "dizzy",
        "e1llas",
        "jellyuh",
        "julialuxel",
        "mowogan",
        "ovrht",
        "omie",
        "pokirule",
        "psp1g",
        "ryanpotat",
        "swormbeard",
        "vaiastol",
        "wuh6",
        "yopego",
        "xriggby"
    ];
</script>

<Meta
    image="/favicon.png"
    description="Various stats and leaderboards collected for the command-line chatbot game, GOFISH."
/>

<span>channel: </span>
<select bind:value={selected} onchange={selectChannel} class="mt-5 mb-5">
    {#each channels as channel}
        <option value={channel}>{channel}</option>
    {/each}
</select>

{#if loaded}
    <Leaderboards folder={selected} />
{/if}
