import fs from "node:fs/promises";
import swaggerJsdoc from "swagger-jsdoc";
const swaggerSpec = async () => {
    const spec = swaggerJsdoc({
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Backend Project API",
                version: "1.0.0",
            },
            servers: [{ url: "http://localhost:3000" }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
        apis: [
            "./app.ts",
            "./src/controllers/*.ts",
            "./dist/src/controllers/*.js",
        ],
    });
    await fs.mkdir("docs", { recursive: true });
    await fs.writeFile("docs/swagger.json", JSON.stringify(spec, null, 2));
    console.log("Swagger spec written to docs/swagger.json");
    return spec;
};
export default swaggerSpec;
//# sourceMappingURL=swagger-gen.js.map