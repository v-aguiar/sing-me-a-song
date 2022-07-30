import { faker } from "@faker-js/faker";
import supertest from "supertest";

import { prisma } from "../src/database.js";
import { Recommendation } from "@prisma/client";
import { CreateRecommendationData } from "../src/services/recommendationsService.js";

import app from "../src/app.js";
import scenarioFactory from "./factories/scenarioFactory.js";
import recommendationFactory from "./factories/recommendationFactory.js";

beforeEach(async () => {
  await prisma.recommendation.deleteMany({});
});

const APP = supertest(app);

describe("POST '/recommendations'", () => {
  it("should return status code 201 if created", async () => {
    const recommendation: CreateRecommendationData = {
      name: faker.name.firstName(),
      youtubeLink: "https://www.youtube.com/" + faker.animal.type(),
    };
    const response = await APP.post("/recommendations").send(recommendation);
    expect(response.status).toBe(201);

    const createdRecommendation = await prisma.recommendation.findFirst({
      where: { name: recommendation.name },
    });
    expect(createdRecommendation).not.toBeNull();
  }, 10000);
});

describe("GET '/recommendations'", () => {
  it("should return all found recommendations and status code 200", async () => {
    const recommendations = await scenarioFactory.createScenarioWithFiveRecommendations();
    const response = await APP.get("/recommendations");

    expect(response.status).toBe(200);
    expect(response.body.sort((a: Recommendation, b: Recommendation) => a.id - b.id)).toEqual<
      Recommendation[]
    >(recommendations.sort((a, b) => a.id - b.id));
  }, 10000);

  it("should only return a maximun of 10 recommendations", async () => {
    await scenarioFactory.createScenarioWithTwentyRecommendations();

    const response = await APP.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(10);
  });
});

describe("POST '/recommendations/:id/upvote'", () => {
  it("should increase by 1 the recommendation score", async () => {
    const recommendation = await recommendationFactory.createRecommendation();
    const response = await APP.post(`/recommendations/${recommendation.id}/upvote`);
    expect(response.status).toBe(200);

    const updatedRecommendation = await prisma.recommendation.findUnique({
      where: { id: recommendation.id },
    });
    expect(updatedRecommendation?.score).toStrictEqual(recommendation.score + 1);
  });
});

describe("POST '/recommendations/:id/downvote'", () => {
  it("should decrease by 1 the recommendation score", async () => {
    const recommendation = await scenarioFactory.createScenarioWithOneUpvotedRecommendation();

    const response = await APP.post(`/recommendations/${recommendation.id}/downvote`);
    expect(response.status).toBe(200);

    const updatedRecommendation = await prisma.recommendation.findUnique({
      where: { id: recommendation.id },
    });
    expect(updatedRecommendation?.score).toStrictEqual(recommendation.score - 1);
  });

  it("should remove recommendation if score is -5 and it receives a downvote", async () => {
    const recommendation = await scenarioFactory.createScenarioWithNegativeScoreLimitRecommendation();

    const response = await APP.post(`/recommendations/${recommendation.id}/downvote`);
    expect(response.status).toBe(200);

    const updatedRecommendation = await prisma.recommendation.findUnique({
      where: { id: recommendation.id },
    });
    expect(updatedRecommendation).toBeNull();
  });
});

describe("GET '/recommendations/:id'", () => {
  it("should return the recommendation with the given id and status code 200", async () => {
    const recommendations = await scenarioFactory.createScenarioWithFiveRecommendations();

    const response = await APP.get(`/recommendations/${recommendations[3].id}`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(recommendations[3]);
  });
});

describe("GET '/recommendations/top/:amount'", () => {
  it("Should return 4 recommendations, when the parameter ':amount' equals 4", async () => {
    await scenarioFactory.createScenarioWithFiveRecommendations();

    const response = await APP.get("/recommendations/top/4");
    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(4);
  });

  it("Should return 3 recommendations, when the parameter ':amount' equals 3", async () => {
    const recommendations = await scenarioFactory.createScenarioWithFiveRecommendations();

    const response = await APP.get("/recommendations/top/3");

    expect(response.status).toBe(200);
    expect(response.body.length).toStrictEqual(3);
    expect(response.body).toEqual(recommendations.splice(0, 3));
  });
});

describe("GET '/recommendations/random'", () => {
  it("Should return one random recommendation", async () => {
    const recommendations = await scenarioFactory.createScenarioWithFiveRecommendations();

    const response = await APP.get("/recommendations/random");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(recommendations.find((r) => r.id === response.body.id));
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
