import recommendationFactory from "./recommendationFactory.js";

const scenarioFactory = {
  createScenarioWithFiveRecommendations: async () => {
    const recommendation1 = await recommendationFactory.createRecommendation();
    const recommendation2 = await recommendationFactory.createRecommendation();
    const recommendation3 = await recommendationFactory.createRecommendation();
    const recommendation4 = await recommendationFactory.createRecommendation();
    const recommendation5 = await recommendationFactory.createRecommendation();

    return { recommendation1, recommendation2, recommendation3, recommendation4, recommendation5 };
  },
};

export default scenarioFactory;
