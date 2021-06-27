import request from 'supertest'
import { getConnection } from "typeorm"
import { app } from '../app'

import createConnection from '../database'

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    });

    afterAll(async () => {
        const connection = getConnection()
        await connection.dropDatabase()
        await connection.close()
    });

    // Create a New User
    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
            name: "User Example",
            email: "user@example.com",
            password: "1234",
            admin: true
        })

        expect(response.status).toBe(200);
    });

    it("Shouldn't be able to create a new user because the email is null", async () => {
        const response = await request(app).post("/users").send({
            name: "User Example",
            email: null,
            password: "1234",
            admin: true
        })

        expect(response.status).toBe(400);
    });

    // Login The User
    it("Should be able to login the user", async () => {
        const response = await request(app).post("/login").send({
            email: "user@example.com",
            password: "1234"
        });

        expect(response.status).toBe(200);
    });

    it("Shouldn't be able to login the user because the data is wrong", async () => {
        const response = await request(app).post("/login").send({
            email: "user@example.com",
            password: "4321"
        });

        expect(response.status).toBe(400);
    });

    // List The Users
    it("Should be able to list the users because it's authenticated", async () => {
        const token = await request(app).post("/login").send({
            email: "user@example.com",
            password: "1234"
        });
        const response = await request(app).get("/users").set('Authorization', `Bearer ${token.body}`);

        expect(response.status).toBe(200);
    });

    it("Shouldn't be able to list the users because it's not authenticated", async () => {
        const response = await request(app).get("/users");

        expect(response.status).toBe(401);
    });
});