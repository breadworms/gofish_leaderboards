<script lang="ts">
    import { dev } from "$app/environment";
    import { USER_MAP } from "$lib";
    import { slide } from "svelte/transition";
    import { marked, Renderer } from "marked";
    import twemoji from "@twemoji/api";

    interface Props {
        /** a direct url to a markdown file to render */
        url: string;
        /** whether or not links to user profiles will be included in the rendered markdown */
        profileLinks?: boolean;
    }

    let { url, profileLinks = true }: Props = $props();

    async function request(url: string): Promise<string> {
        const res = await fetch(url);
        if (!res.ok) {
            let err = new Error(`request to ${url} failed: ${res.status}`);
            if (dev) {
                console.warn(err);
            }
            throw err;
        }
        return res.text();
    }

    let markedRenderer = USER_MAP.then((map) => {
        const renderer = new Renderer();

        renderer.text = twemoji.parse;

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
    <div in:slide={{ duration: 250 }}>
        {@html marked.parse(resp, { renderer })}
    </div>
{:catch e}
    {#if dev}
        <div class="text-red-400">{e}</div>
    {/if}
{/await}
