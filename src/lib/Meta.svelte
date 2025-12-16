<script lang="ts">
    /** description shown on embedded cards */
    export let description = 'Leaderboards for gofish';
    /** applies both `<title>` and `<meta name="twitter:title">` */
    export let title = 'unofficial gofish leaderboards';
    /** a subtitle appended to `<title>` and embedded cards */
    export let breadcrumb: string | undefined = undefined;
    /**
     * applies both `<meta name="og:image">` and `<meta name="twitter:image">`
     *
     * must be a URL to static image, preferably a .png or .jpeg
     */
    export let image: string | URL | undefined = undefined;
</script>

<!--
@component
Modifies the `<head>` of the document to add embed card info to the current page
-->

<svelte:head>
    <meta name="description" content={description} />
    <meta name="twitter:description" content={description} />
    <meta property="og:description" content={description} />
    <meta name="twitter:title" content={breadcrumb ?? title} />
    <title>{(breadcrumb ? breadcrumb + ' - ' : '') + title}</title>
    {#if image}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={String(image)} />
        <meta property="og:image" content={String(image)} />
    {:else}
        <meta name="twitter:card" content="summary" />
    {/if}
</svelte:head>
