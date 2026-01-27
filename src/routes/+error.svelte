<script lang="ts">
    import { page } from "$app/state";
</script>

<div class="flex flex-col w-full h-screen items-center justify-center">
    <h1>{page.status}: {page.error?.message}</h1>
    <a href="/" class="mt-8">Go back</a>
</div>
