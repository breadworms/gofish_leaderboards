<script lang="ts">
    import type { WrappedUser } from "./Wrapped.svelte";

    interface Props {
        data: WrappedUser;
    }

    let { data }: Props = $props();
</script>

<div>
    rare fish
</div>
