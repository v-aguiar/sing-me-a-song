import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

import { prisma } from "../../src/database.js";

const recommendationFactory = {
  createRecommendation: async () => {
    const recommendation: Recommendation = await prisma.recommendation.create({
      data: {
        name: faker.name.firstName(),
        youtubeLink: "https://www.youtube.com/" + faker.animal.type(),
      },
    });
    return recommendation;
  },
};

export default recommendationFactory;
