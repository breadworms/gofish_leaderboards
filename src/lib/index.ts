// place files you want to import through the `$lib` alias in this folder.

import twemoji from "@twemoji/api";

const knownShinies: Record<string, string> = {
    "DarkMode": `<img class="emoji" draggable="false" alt="DarkMode" src="https://static-cdn.jtvnw.net/emoticons/v2/461298/default/dark/3.0" />`,
    "SabaPing": `<img class="emoji" draggable="false" alt="SabaPing" https://static-cdn.jtvnw.net/emoticons/v2/160402/default/dark/3.0 />`,
    "OSFrog": `<img class="emoji" draggable="false" alt="OSFrog" https://static-cdn.jtvnw.net/emoticons/v2/81248/default/dark/3.0 />`,
    "HailHelix": `<img class="emoji" draggable="false" alt="HailHelix" https://cdn.betterttv.net/emote/54fa90f201e468494b85b545/3x.webp />`
};

/** user login -> id map */
export const USER_MAP: Promise<Map<string, number>> = fetch(
    "https://raw.githubusercontent.com/blableblup/gofish/refs/heads/main/leaderboards/global/profiles/nameID.json"
)
    .then((resp) => resp.json())
    .then((data: { Name: string; ID: number }[]) => new Map(data.map((e) => [e.Name, e.ID])));

/** turn leaderboard fish to an `<img>` tag */
export function fishToImage(rawFish: string) {
    const shinyMatch = rawFish.match(/^!\[(.*)\]\(.*\)/);

    if (shinyMatch !== null) {
        return knownShinies[shinyMatch[1]];
    }

    const emoji = rawFish.match(/^(\p{Emoji}\S*)/u)?.[1] ?? "❓";

    return twemoji.parse(emoji);
}

export interface Wrapped2025User {
    name: string;
    startDate: number;
    endDate: number;
    fishSeenCount: number;
    fishSeenPercentile: number;
    caughtCount: number;
    caughtPercentile: number;
    chats: {
        chat: string;
        caughtCount: number;
        caughtPercentile: number;
        timeSpentPercentage: number;
    }[];
    locations: {
        location: "acornpond" | "big" | "docks",
        missCount: number,
        missPercentile: number,
        timeSpentPercentage: number,
        weather: {
            ambiance: string,
            timeSpentPercentage: number
        }[]
    }[];
    sizeTopFive: {
        fish: string,
        weight: number,
        catchType: "normal",
        catchDate: number,
        rank: number,
        rankAllTime: number
    }[];
    frequencyTopFive: {
        fish: string,
        count: number
    }[];
    rarityTopFive: {
        fish: string,
        countGlobal: number,
        countGlobalAllTime: number
    }[];
}
