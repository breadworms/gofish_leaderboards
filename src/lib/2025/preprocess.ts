// run with `npx vite-node`
//
//     processes files received from leaderboards author
//     to be uploaded to data.gofish.lol
//
//     ONLY `import type` FROM THIS FILE
//

import {
    existsSync,
    lstatSync,
    mkdirSync,
    readdirSync,
    writeFileSync
} from "node:fs";
import { join, parse } from "node:path";
import { createHash } from "node:crypto";
import twemoji from "@twemoji/api";

// See: (received personally)
export type WrappedUserLocation = "acornpond"
    | "big"
    | "docks"
    | "train"
    | "slotmachine";

// See: (received personally)
export type WrappedUserAmbiance = "winterpond"
    | "windy"
    | "train"
    | "sunny"
    | "summerpond"
    | "summernight"
    | "springpond"
    | "snowylake"
    | "snowy"
    | "slotmachine"
    | "rainy"
    | "nothing"
    | "normallake"
    | "misty"
    | "minecart"
    | "meltinglake"
    | "heatwave"
    | "hauntedlake"
    | "grotto"
    | "frozenlake"
    | "freezing"
    | "foggylake"
    | "fallpond"
    | "drylake";

// See: https://github.com/blableblup/gofish/blob/eb41268cec4a25a8a276b24c5f645b8b44ba1d23/leaderboards/leaderboards_sql.go#L259
export type WrappedUserCatchType = "normal"
    | "hatchedegg"
    | "releasebonus"
    | "pumpkinreleasebonus"
    | "jumpedbonus"
    | "mouthbonus"
    | "squirrel"
    | "squirrelfail"
    | "sonnythrow"
    | "bellgift"
    | "winterpresent"
    | "receivedpresent";

export interface WrappedUser {
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
        timeSpentPercent: number;
    }[];
    locations: {
        location: WrappedUserLocation,
        missCount: number,
        missPercentile: number,
        timeSpentPercent: number,
        weather: {
            ambiance: WrappedUserAmbiance,
            timeSpentPercent: number
        }[]
    }[];
    sizeTopFive: {
        image: string,
        weight: number,
        catchType: WrappedUserCatchType,
        catchDate: number,
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

// mimic twemoji img tags here (kinda dumb)
const shinies: Record<string, string> = {
    "DarkMode": `<img class="fish" draggable="false" alt="DarkMode" src="https://static-cdn.jtvnw.net/emoticons/v2/461298/default/dark/3.0"/>`,
    "SabaPing": `<img class="fish" draggable="false" alt="SabaPing" src="https://static-cdn.jtvnw.net/emoticons/v2/160402/default/dark/3.0"/>`,
    "OSFrog": `<img class="fish" draggable="false" alt="OSFrog" src="https://static-cdn.jtvnw.net/emoticons/v2/81248/default/dark/3.0" />`,
    "HailHelix": `<img class="fish" draggable="false" alt="HailHelix" src="https://cdn.betterttv.net/emote/54fa90f201e468494b85b545/3x.webp"/>`
};

function fishToImage(fish: string) {
    const emote = fish.split(" ")[0];

    return shinies.hasOwnProperty(emote)
        ? shinies[emote]
        : twemoji.parse(emote, { className: "fish" });
}

function processFile(path: string): WrappedUser {
    const raw = require(path);

    return {
        name: raw["Name"] as string,
        startDate: (new Date(`${raw["Year"]}-04-01 00:00:00 UTC`)).getTime(),
        endDate: (new Date(`${Number(raw["Year"]) + 1}-04-01 00:00:00 UTC`)).getTime(),
        fishSeenCount: raw["FishSeenCount"] as number,
        fishSeenPercentile: Math.round(100 - raw["FishSeenPercentile"]),
        caughtCount: raw["Count"]["Total"] as number,
        caughtPercentile: Math.round(100 - raw["Count"]["Percentile"]),
        chats: Object.entries(raw["Count"]?.["ChatCounts"] ?? {}).map(([chat, rawChat]: [string, any]) => ({
            chat,
            caughtCount: rawChat["Total"] as number,
            caughtPercentile: Math.round(100 - rawChat["Percentile"]),
            timeSpentPercent: Math.round(rawChat["Percentage"])
        })).sort((a, b) => b.caughtCount - a.caughtCount),
        locations: Object.entries(raw["FishLocations"] ?? {}).map(([location, rawLocation]: [string, any]) => ({
            location: location as WrappedUserLocation,
            missCount: rawLocation["Count"] as number,
            missPercentile: Math.round(100 - rawLocation["Percentile"]),
            timeSpentPercent: Math.round(rawLocation["Percentage"]),
            weather: (rawLocation["Ambiences"] as any[] ?? []).map(rawWeather => ({
                ambiance: rawWeather["Ambience"] as WrappedUserAmbiance,
                timeSpentPercent: Math.round(rawWeather["Percentage"])
            })).sort((a, b) => b.timeSpentPercent - a.timeSpentPercent)
        })).sort((a, b) => b.missCount - a.missCount),
        sizeTopFive: (raw["BiggestFish"] as any[] ?? []).map(rawSize => ({
            image: fishToImage(rawSize["Fish"]),
            weight: rawSize["Weight in lbs"] as number,
            catchType: (rawSize["Catchtype"] as string).toLowerCase().replaceAll(' ', '') as WrappedUserCatchType,
            catchDate: (new Date(rawSize["Date"])).getTime(),
            rank: rawSize["Rank"] as number,
            rankAllTime: rawSize["RankAllTime"] as number
        })),
        frequencyTopFive: (raw["MostCaughtFish"] as any[] ?? []).map(rawFrequency => ({
            image: fishToImage(rawFrequency["Fish"]),
            count: rawFrequency["Count"] as number
        })),
        rarityTopFive: (raw["RarestFish"] as any[] ?? []).map(rawRarest => ({
            image: fishToImage(rawRarest["Fish"]),
            countGlobal: rawRarest["CountYear"] as number,
            countGlobalAllTime: rawRarest["CountAllTime"] as number
        }))
    };
}

function generateId(userId: string, salt: string) {
    return createHash("sha256")
        .update(`${userId}_${salt}`)
        .digest("hex");
}

const [_, __, dir, salt] = process.argv;

if (dir === undefined || salt === undefined) {
    throw new Error(`A target directory and salt must be specified.`);
}

if (!existsSync(dir) || !lstatSync(dir).isDirectory()) {
    throw new Error(`Target directory must be an existing directory.`);
}

const outDir = join(dir, "build");

if (!existsSync(outDir)) {
    mkdirSync(outDir);
} else if (!lstatSync(outDir).isDirectory()) {
    throw new Error(`Unable to create build directory.`);
}

let total = 0;

readdirSync(dir).forEach(filename => {
    const file = join(dir, filename);
    const path = parse(file);

    if (path.ext !== ".json") {
        console.log(`skipping ${file}...`);

        return;
    }

    console.log(`processing ${file}...`);

    const data = processFile(file);
    const outFile = join(outDir, `${generateId(path.name, salt)}.json`);

    console.log(`writing to ${outFile}...`);

    writeFileSync(outFile, JSON.stringify(data));

    total += 1;
});

console.log(`done! processed ${total} files`);
