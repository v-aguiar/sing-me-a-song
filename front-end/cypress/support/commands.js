import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

Cypress.Commands.add("resetDatabase", () => {
  cy.request({
    method: "DELETE",
    url: "http://localhost:5000/recommendations/truncate",
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("createRecommendation", () => {
  const name = faker.music.songName();
  const urlRandomizer = faker.color.human();
  const url = `https://www.youtube.com/${urlRandomizer}`;

  cy.intercept(URL).as("loadData");
  cy.visit(URL);
  cy.wait("@loadData");

  cy.get("#nameInput").type(name);
  cy.get("#videoUrlInput").type(url);
  cy.intercept("POST", "/recommendations").as("create");
  cy.get("#createBtn").click();
  cy.wait("@create");
});
