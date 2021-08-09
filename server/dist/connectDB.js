"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const connectionOptions = {
    developtment: {
        type: "mysql",
        host: process.env.DATABASE_LOCAL_HOST,
        port: Number(process.env.DATABASE_LOCAL_PORT),
        username: process.env.DATABASE_LOCAL_USERNAME,
        password: process.env.DATABASE_LOCAL_PASSWORD,
        database: process.env.DATABASE_LOCAL_NAME,
        synchronize: true,
        logging: false,
        entities: ["entity/**/*.{ts,js}"],
        migrations: ["migration/**/*.{ts,js}"],
        subscribers: ["subscriber/**/*.{ts,js}"],
        cli: {
            entitiesDir: "entity",
            migrationsDir: "migration",
            subscribersDir: "subscriber",
        },
    },
    production: {
        type: "mysql",
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true,
        logging: false,
        entities: ["entity/**/*.{ts,js}"],
        migrations: ["migration/**/*.{ts,js}"],
        subscribers: ["subscriber/**/*.{ts,js}"],
        cli: {
            entitiesDir: "entity",
            migrationsDir: "migration",
            subscribersDir: "subscriber",
        },
    },
};
const env = process.env.NODE_ENV || "developtment";
const connectionOption = connectionOptions[env];
console.log("Database info: ", connectionOption);
const connectDB = () => {
    typeorm_1.createConnection(connectionOption)
        .then(async () => {
        console.log("Database connected");
    })
        .catch((error) => {
        console.log("Failed to connect database");
        console.log(error);
    });
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
//# sourceMappingURL=connectDB.js.map