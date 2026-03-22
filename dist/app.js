/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: Root health check
 *     responses:
 *       200:
 *         description: Plain text greeting
 */
import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./src/routes/user.routes.js";
import dataSource from "./src/db/data-source.js";
import authRoutes from "./src/routes/auth.routes.js";
import errorHandlerMiddleware from "./src/middlewares/errorhandler.middleware.js";
import authenticationMiddleware from "./src/middlewares/authentication.middleware.js";
import productRoutes from "./src/routes/product.routes.js";
import swaggerSpec from "./scripts/swagger-gen.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", authenticationMiddleware, productRoutes);
app.use(errorHandlerMiddleware);
(async () => {
    try {
        await dataSource.initialize();
        console.log("Database connected");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }
    catch (error) {
        console.error("Error connecting to database", error);
    }
})();
//# sourceMappingURL=app.js.map