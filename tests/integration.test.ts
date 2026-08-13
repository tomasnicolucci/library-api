import request from "supertest";
import {
  beforeEach,
  describe,
  expect,
  it
} from "vitest";

import app from "../src/app.js";
import { pool } from "../src/database/connection.js";
import { clearDatabase } from "./helpers/database.js";

const createUserAndLogin = async (
  email: string,
  role: "USER" | "ADMIN" = "USER"
) => {
  await request(app)
    .post("/auth/register")
    .send({
      name: "Test User",
      email,
      password: "12345678"
    });

  if (role === "ADMIN") {
    await pool.query(
      `
        UPDATE users
        SET role = 'ADMIN'
        WHERE email = $1
      `,
      [email]
    );
  }

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email,
      password: "12345678"
    });

  return loginResponse.body.accessToken;
};

describe("Library API integration", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should forbid USER from creating an author", async () => {
    const token = await createUserAndLogin(
      "user@example.com"
    );

    const response = await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "George Orwell"
      });

    expect(response.status).toBe(403);
  });

  it("should allow ADMIN to create an author", async () => {
    const token = await createUserAndLogin(
      "admin@example.com",
      "ADMIN"
    );

    const response = await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "George Orwell"
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("George Orwell");
  });

  it("should allow ADMIN to create a book", async () => {
    const token = await createUserAndLogin(
      "admin@example.com",
      "ADMIN"
    );

    const authorResponse = await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "George Orwell"
      });

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "1984",
        isbn: "9780451524935",
        publishedYear: 1949,
        authorId: authorResponse.body.id
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("1984");
  });

  it("should not allow the same book to have two active loans", async () => {
    const adminToken = await createUserAndLogin(
      "admin@example.com",
      "ADMIN"
    );

    const authorResponse = await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "George Orwell"
      });

    const bookResponse = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "1984",
        isbn: "9780451524935",
        publishedYear: 1949,
        authorId: authorResponse.body.id
      });

    const userToken = await createUserAndLogin(
      "user@example.com"
    );

    const loanBody = {
      bookId: bookResponse.body.id,
      dueAt: "2026-09-01T18:00:00.000Z"
    };

    const firstLoan = await request(app)
      .post("/loans")
      .set("Authorization", `Bearer ${userToken}`)
      .send(loanBody);

    expect(firstLoan.status).toBe(201);

    const secondLoan = await request(app)
      .post("/loans")
      .set("Authorization", `Bearer ${userToken}`)
      .send(loanBody);

    expect(secondLoan.status).toBe(409);
  });

  it("should return a loan and allow the book to be borrowed again", async () => {
    const adminToken = await createUserAndLogin(
      "admin@example.com",
      "ADMIN"
    );

    const authorResponse = await request(app)
      .post("/authors")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "George Orwell"
      });

    const bookResponse = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "1984",
        isbn: "9780451524935",
        publishedYear: 1949,
        authorId: authorResponse.body.id
      });

    const userToken = await createUserAndLogin(
      "user@example.com"
    );

    const loanBody = {
      bookId: bookResponse.body.id,
      dueAt: "2026-09-01T18:00:00.000Z"
    };

    const loanResponse = await request(app)
      .post("/loans")
      .set("Authorization", `Bearer ${userToken}`)
      .send(loanBody);

    const returnResponse = await request(app)
      .post(`/loans/${loanResponse.body.id}/return`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(returnResponse.status).toBe(200);
    expect(returnResponse.body.returned_at).not.toBeNull();

    const newLoan = await request(app)
      .post("/loans")
      .set("Authorization", `Bearer ${userToken}`)
      .send(loanBody);

    expect(newLoan.status).toBe(201);
  });
});