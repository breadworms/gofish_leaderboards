<script lang="ts">
    let {
        title = 'unofficial gofish leaderboards',
        description,
        breadcrumb,
        image
    }: {
        /** applies both `<title>` and `<meta name="twitter:title">` */
        title?: string;
        /** description shown on embedded cards */
        description?: string;
        /** a subtitle appended to `<title>` and embedded cards */
        breadcrumb?: string;
        /**
         * applies both `<meta name="og:image">` and `<meta name="twitter:image">`
         *
         * must be a URL to static image, preferably a .png or .jpeg
         */
        image?: string;
    } = $props();
</script>

<!--
@component
Modifies the `<head>` of the document to add embed card info to the current page
-->

<svelte:head>
    {#if description}
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
    {/if}
    {#if breadcrumb}
        <meta name="twitter:title" content={breadcrumb} />
        <title>{breadcrumb} - {title}</title>
    {:else}
        <meta name="twitter:title" content={title} />
        <title>{title}</title>
    {/if}
    <meta name="twitter:card" content="summary" />
    {#if image}
        <meta name="twitter:image" content={String(image)} />
        <meta property="og:image" content={String(image)} />
    {/if}
</svelte:head>
