import request from 'supertest'
import { getConnection } from "typeorm"
import { app } from '../app'

import createConnection from '../database'

describe("Tags", () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    });

    afterAll(async () => {
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    });

    // Create a New Tag
    it("Should be able to create a new tag because it's admin and authenticated", async () => {
        await request(app).post("/users").send({
            name: "User Example",
            email: "user@example.com",
            password: "1234",
            admin: true
        });

        const token = await request(app).post("/login").send({
            email: "user@example.com",
            password: "1234"
        });

        const response = await request(app).post("/tags").send({
            name: "Teste"
        }).set('Authorization', `Bearer ${token.body}`);

        expect(response.status).toBe(200);
    });

    it("Shouldn't be able to create a new tag because the name is null", async () => {
        const token = await request(app).post("/login").send({
            email: "user@example.com",
            password: "1234"
        });

        const response = await request(app).post("/tags").set('Authorization', `Bearer ${token.body}`);

        expect(response.status).toBe(400);
    });

    it("Shouldn't be able to create a new tag because it's not authenticated", async () => {
        const response = await request(app).post("/tags").send({
            name: "Teste"
        });

        expect(response.status).toBe(401);
    });

    // List The Tags
    it("Should be able to list the tags because it's authenticated", async () => {
        const token = await request(app).post("/login").send({
            email: "user@example.com",
            password: "1234"
        });

        const response = await request(app).get("/tags").set('Authorization', `Bearer ${token.body}`);

        expect(response.status).toBe(200);
    });

    it("Shouldn't be able to list the tags because it's not authenticated", async () => {
        const response = await request(app).get("/tags");

        expect(response.status).toBe(401);
    });
});