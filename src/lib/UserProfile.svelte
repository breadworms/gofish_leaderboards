<script lang="ts">
    import AsyncMarkdownReq from "./AsyncMarkdownReq.svelte";

    let {
        id
    }: {
        id: string | number
    } = $props();
</script>

<AsyncMarkdownReq
    url={`https://raw.githubusercontent.com/blableblup/gofish/refs/heads/main/leaderboards/global/profiles/${id}.md`}
    profileLinks={false}
/>
