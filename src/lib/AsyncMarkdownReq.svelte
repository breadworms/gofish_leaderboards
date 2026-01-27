<script lang="ts">
    import { dev } from "$app/environment";
    import { USER_MAP } from "$lib";
    import { slide } from "svelte/transition";
    import { marked, Renderer } from "marked";

    let {
        url,
        profileLinks = true
    }: {
        /** a direct url to a markdown file to render */
        url: string;
        /** whether or not links to user profiles will be included in the rendered markdown */
        profileLinks?: boolean;
    } = $props();

    async function request(url: string): Promise<string> {
        let res = await fetch(url);
        if (!res.ok) {
            let err = new Error(`request to ${url} failed: ${res.status}`);
            if (dev) {
                console.warn(err);
            }
            throw err;
        }
        let md = await res.text();
        return md;
    }

    let markedRenderer = USER_MAP.then((map) => {
        const renderer = new Renderer();

        // TailwindCSS makes img elements have display: block for *some* reason so
        // this fixes it in this very specific instance ehehe
        renderer.image = function(href, title, text) {
            return `<img src=${href} title=${title ?? text} alt=${text} style="display: inline-block; max-width: none;" />`;
        };

        if (profileLinks) {
            renderer.tablecell = function(content, flags) {
                // TODO: modify the html
                // const parser = new DOMParser()
                // const doc = parser.parseFromString(content, "text/html")
                const elem = flags.header ? "th" : "td";
                let maybeLogin = content.trim().replace(/\*$/, "");
                if (map.get(maybeLogin)) {
                    content = `<a href="/profile/?user=${maybeLogin}">${content}</a>`;
                }
                return `<${elem}>${content}</${elem}>`;
            }
        }

        return renderer;
    });
</script>

{#await Promise.all([request(url), markedRenderer])}
    <div>Loading...</div>
{:then [resp, renderer]}
    <div transition:slide={{ duration: 250 }}>
        {@html marked.parse(resp, { renderer })}
    </div>
{:catch e}
    {#if dev}
        <div class="text-red-400">{e}</div>
    {/if}
{/await}
