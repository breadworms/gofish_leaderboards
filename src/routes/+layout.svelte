<script>
    import "../app.css";
    import Meta from "$lib/Meta.svelte";
</script>

<Meta
    description="Leaderboards for gofish"
    title="unofficial gofish leaderboards"
    image="/favicon.png"
/>

<div class="mx-4 lg:mx-8 my-8 lg:ml-32 lg:mr-32">
    <div class="lg:mx-96 p-8 border-2 rounded-lg">
        <h1 class="mb-4 text-4xl text-white">The bot is currently down.</h1>
        <h2 class="text-xl mb-2">A message from breadworms</h2>
        <p class="mb-2">
            Hi, I'm breadworms, the author of GO FISH GAME. <a href="https://x.com/i/status/2008629463634808924">My Twitch account has been indefinitely
            suspended</a> and I've submitted an appeal. The account gofishgame was suspended in tandem.
            Aside from GO FISH GAME I'm a streamer and am hoping to have the situation resolved as
            soon as possible.
        </p>
        <p class="mb-2">
            You can contact me @breadworms on Discord and
            <a href="https://x.com/breadworms">Twitter</a>
            if you have any questions.
        </p>
    </div>
    <header>
        <a href="/" class="text-inherit font-semibold">
            <h1 class="mb-4 mt-8">unofficial gofish leaderboards! 🎣 🤩 🏆</h1>
        </a>
        <hr class="mb-4 mt-8" />
    </header>
    <main>
        <slot />
    </main>
    <footer class="mb-12 mt-32">
        <p>
            gofish by <a href="https://twitch.tv/breadworms">breadworms</a>
        </p>
        <p>
            website source code <a href="https://github.com/Juliapixel/gofish_leaderboards">here</a>
        </p>
        <p>
            data sourced from <a href="https://github.com/blableblup/gofish">here</a>
        </p>
        <p class="text-center mt-8 text-neutral-500">
            {">~<"}
        </p>
    </footer>
</div>
