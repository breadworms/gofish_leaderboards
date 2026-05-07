<script lang="ts">
    interface Props {
        bubbleImages: string[];
    }

    let { bubbleImages }: Props = $props();
    let overlay: HTMLDivElement;
    let _burst: number | undefined;

    export function bubble() {
        if (overlay.children.length >= overlay.clientWidth / 100) {
            return;
        }

        const bubble = document.createElement("div");

        bubble.style.setProperty("--bubble", `url(${bubbleImages[Math.floor(Math.random() * bubbleImages.length)]})`);
        bubble.style.setProperty("--bubble-position", `${Math.floor(Math.random() * 100)}%`);
        bubble.style.setProperty("--bubble-size", `${Math.floor(Math.random() * 100) + 50}px`);
        bubble.style.setProperty("--bubble-noise", `${-Math.floor(Math.random() * 2000)}ms`);

        if (_burst !== undefined) {
            bubble.style.setProperty("--bubble-speed", `${Math.floor(Math.random() * 1000) + 500}ms`);
            bubble.style.setProperty("--bubble-animation", "ease-in");
        } else {
            bubble.style.setProperty("--bubble-speed", `${Math.floor(Math.random() * 10) + 40}s`);
            bubble.style.setProperty("--bubble-animation", "linear");
        }

        bubble.className = "bubble";
        bubble.addEventListener("animationend", () => overlay.removeChild(bubble));
        overlay.appendChild(bubble);
    }

    export function burst() {
        if (_burst !== undefined) {
            return;
        }

        _burst = setInterval(bubble, 10);

        setTimeout(() => {
            clearInterval(_burst);
            _burst = undefined;
        }, 1000);
    }
</script>

<svelte:head>
    {#each bubbleImages as image}
        <link rel="prefetch" as="image" href={image} />
    {/each}
</svelte:head>

<div bind:this={overlay} class="particles">
</div>

<style lang="postcss">
    .particles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
        pointer-events: none;
        user-select: none;

        :global(.bubble) {
            position: absolute;
            bottom: 0;
            left: var(--bubble-position);
            transform: translate(-50%, 100%);
            height: var(--bubble-size);
            width: var(--bubble-size);
            background-image: var(--bubble);
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            image-rendering: pixelated;
            animation: bubbleUp var(--bubble-speed) var(--bubble-animation), bubbleSway 2s ease-in-out var(--bubble-noise) infinite alternate;
        }
    }

    @keyframes bubbleUp {
        0% {
            bottom: 0%;
        }
        100% {
            bottom: calc(100% + var(--bubble-size));
        }
    }

    @keyframes bubbleSway {
        0% {
            margin-left: 0px;
        }
        100% {
            margin-left: 50px;
        }
    }
</style>
