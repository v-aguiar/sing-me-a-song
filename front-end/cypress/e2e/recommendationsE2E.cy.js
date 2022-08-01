/// <reference types="cypress" />

describe("E2E recommendations tests", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("should create a recommendation", () => {
    cy.createRecommendation();

    cy.get(".recommendationContainer").should("exist");
  });

  it("should increase the score by one, when a recommendation is upvoted", () => {
    cy.createRecommendation();

    cy.get(".upvoteButton").click();
    cy.get(".score").should("contain.text", 1);
  });

  it("should decrease the score by one, when a recommendation is downvoted", () => {
    cy.createRecommendation();

    cy.get(".downvoteButton").click();
    cy.get(".score").should("contain.text", -1);
  });
});
