// place files you want to import through the `$lib` alias in this folder.

/** user login -> id map */
export const USER_MAP: Promise<Map<string, number>> = fetch(
    "https://raw.githubusercontent.com/blableblup/gofish/refs/heads/main/leaderboards/global/profiles/nameID.json"
)
    .then((resp) => resp.json())
    .then((data: { Name: string; ID: number }[]) => new Map(data.map((e) => [e.Name, e.ID])));

export interface Wrapped2025User {
    name: string;
    startDate: Date;
    endDate: Date;
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
        image: string,
        weight: number,
        catchType: "normal",
        catchDate: Date,
        rank: number,
        rankAllTime: number
    }[];
    frequencyTopFive: {
        image: string,
        count: number
    }[];
    rarityTopFive: {
        image: string,
        countGlobal: number,
        countGlobalAllTime: number
    }[];
}
