import * as R from 'ramda';
import { parse } from 'csv-parse/sync';
import fs from 'fs';

// I could probably process this data better using streams, but I forget how to do that correctly,
// and these files aren't THAT big anyways...

const SEED_TOMBSTONE = `/*

THIS FILE IS AUTOMATICALLY GENERATED BY scripts/seed.ts
ANY EDITS TO THIS FILE WILL BE OVERWRITTEN WHEN RUNNING THE SEED SCRIPT

*/

`;

const buildCardSeeds = async () => {
    let respID = 1;
    const nextRespId = () => respID++;

    let promptID = 1;
    const nextPromptId = () => promptID++;

    try {
        const responseSurqlFile = fs.createWriteStream('queries/main_response_seed.surql');
        responseSurqlFile.write(SEED_TOMBSTONE);
        await processMainResponses(
            fs.readFileSync('card_data/main_responses.csv'),
            responseSurqlFile,
            nextRespId,
        );
        responseSurqlFile.close();

        const promptSurqlFile = fs.createWriteStream('queries/main_prompt_seed.surql');
        promptSurqlFile.write(SEED_TOMBSTONE);
        await processMainPrompts(
            fs.readFileSync('card_data/main_prompts.csv'),
            promptSurqlFile,
            nextPromptId,
        );
        promptSurqlFile.close();
    } catch (err) {
        console.error("You messed up! Quickly, unplug your machine!");
        throw err;
    }
};

const extractMainHeaders = (parsedCsv: string[][], headerDrops: number[]): [string[], string[][]] => {
    const [countries, versionNumbers] = R
        .take(headerDrops.length, parsedCsv)
        .map((header, idx) => R.drop(headerDrops[idx], header));
    const versionList = R.zip(countries, versionNumbers).map(R.join(''));
    
    const records = R.drop(headerDrops.length, parsedCsv);
    return [versionList, records];
};

const processMainResponses = async (
    input: Buffer,
    file: fs.WriteStream,
    nextId: () => number
) => {
    const [versionList, records] = extractMainHeaders(
        parse(input, { skip_empty_lines: true  }),
        [1, 1, 0]
    );
    await Promise.all(records.map(async record => {
        const [response, ...isVersion] = record;
        const content = {
            response,
            versions: versionList.filter((_, idx) => isVersion[idx].length > 0),
        }
        file.write(`LET $data = ${JSON.stringify(content)};\nCREATE rc:${nextId()} CONTENT $data;\n`);
    }));
};

const processMainPrompts = async (
    input: Buffer,
    file: fs.WriteStream,
    nextId: () => number
) => {
    const [versionList, records] = extractMainHeaders(
        parse(input, { skip_empty_lines: true  }),
        [2, 2, 0]
    );
    await Promise.all(records.map(async record => {
        const [prompt, slots, ...isVersion] = record;
        const content = {
            prompt,
            slots,
            versions: versionList.filter((_, idx) => isVersion[idx].length > 0),
        }
        file.write(`LET $data = ${JSON.stringify(content)};\nCREATE pc:${nextId()} CONTENT $data;\n`);
    }));
};

buildCardSeeds();