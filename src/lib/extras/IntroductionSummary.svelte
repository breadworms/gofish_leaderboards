<script lang="ts">
    import type { Wrapped2025User } from "$lib";

    interface Props {
        data: Wrapped2025User;
    }

    let { data }: Props = $props();
</script>

<h1 class="text-3xl">Ahoy {data.name}!</h1>
<p>
    This is your 2025 wrapped.
</p>
<p>
    {#each data.sizeTopFive as fish, index}
        {index + 1}: {@html fish.fish} {fish.weight} lbs! <br>
    {/each}
</p>
