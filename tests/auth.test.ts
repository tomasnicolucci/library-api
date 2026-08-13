import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "../src/app.js";
import { clearDatabase } from "./helpers/database.js";

describe("Auth", () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it("should register a user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "12345678"
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.passwordHash).toBeUndefined();
  });

  it("should login and return access and refresh tokens", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "12345678"
      });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "12345678"
      });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it("should reject an invalid password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "12345678"
      });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword"
      });

    expect(response.status).toBe(401);
  });
});

it("should rotate refresh tokens", async () => {
  await request(app)
    .post("/auth/register")
    .send({
      name: "Test User",
      email: "test@example.com",
      password: "12345678"
    });

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: "test@example.com",
      password: "12345678"
    });

  const oldRefreshToken =
    loginResponse.body.refreshToken;

  const refreshResponse = await request(app)
    .post("/auth/refresh")
    .send({
      refreshToken: oldRefreshToken
    });

  expect(refreshResponse.status).toBe(200);
  expect(
    refreshResponse.body.accessToken
  ).toBeDefined();

  expect(
    refreshResponse.body.refreshToken
  ).toBeDefined();

  expect(
    refreshResponse.body.refreshToken
  ).not.toBe(oldRefreshToken);

  const reuseResponse = await request(app)
    .post("/auth/refresh")
    .send({
      refreshToken: oldRefreshToken
    });

  expect(reuseResponse.status).toBe(401);
});