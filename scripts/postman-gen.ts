/**
 * Generates docs/postman-collection.json from the same OpenAPI spec as Swagger UI.
 * Run: npm run postman:gen
 */
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import swaggerSpecFn from "./swagger-gen.js";

const require = createRequire(import.meta.url);
const { convertV2 } = require("openapi-to-postmanv2") as {
    convertV2: (
        input: { type: string; data: string },
        options: Record<string, unknown>,
        cb: (
            err: Error | null,
            result: { result: boolean; output?: Array<{ type: string; data: unknown }> },
        ) => void,
    ) => void;
};

const toPostmanCollection = (openApiJson: string): Promise<unknown> =>
    new Promise((resolve, reject) => {
        convertV2({ type: "string", data: openApiJson }, {}, (err, conversionResult) => {
            if (err) {
                reject(err);
                return;
            }
            if (!conversionResult?.result || !conversionResult.output?.[0]?.data) {
                reject(new Error("OpenAPI → Postman conversion failed"));
                return;
            }
            resolve(conversionResult.output[0].data);
        });
    });

const main = async () => {
    const spec = await swaggerSpecFn();
    const openApiJson = JSON.stringify(spec);
    const collection = await toPostmanCollection(openApiJson);
    const outPath = "docs/postman-collection.json";
    await fs.writeFile(outPath, JSON.stringify(collection, null, 2), "utf8");
    console.log(`Postman collection written to ${outPath}`);
    console.log("Import it in Postman: File → Import → select that JSON file.");
};

main().catch((e: unknown) => {
    console.error(e);
    process.exit(1);
});
