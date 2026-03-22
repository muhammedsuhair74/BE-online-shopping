import "reflect-metadata";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "onlineshopping",
    username: "postgres",
    password: "postgres",
    extra: { max: 5, min: 2 }, // connection pool
    synchronize: false,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ["dist/src/entities/*.js"],
    migrations: ["dist/src/db/migrations/*.js"],
});

export default dataSource;