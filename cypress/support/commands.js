import "@testing-library/cypress/add-commands";
///<reference types="cypress"/>
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//takes in an array of links, fixture file name, and  fixture's param
//will compare links' name and href to those provided in fixture
Cypress.Commands.add(
	"linkChecker",
	{ prevSubject: ["optional", "Array"] },
	(linksArr = subject, fixtureFile, fixtureName) => {
		cy.wrap(linksArr).each((link) => {
			cy.fixture(fixtureFile).then((data) => {
				const linkText = Cypress.$(link).text();
				const slugList = data[fixtureName];
				if (cy.wrap(link.attr("href")).should("eq", slugList[linkText])) {
					cy.request(link.prop("href")).then((res) => {
						expect(res.status).eq(200);
					});
				}
			});
		});
	}
);
//before and after comparison of data-table's first column (names) each page turn.
Cypress.Commands.add(
	"pageChecker",
	{ prevSubject: ["optional", "element"] },
	(pageButton = subject, waitFor = 2000) => {
		const page1 = [];
		cy.get(".ant-table-tbody>a.table-row", { timeout: 10000 }).each((tr) => {
			const name = tr.attr("data-row-key").toString();
			page1.push(name);
		});

		cy.get(pageButton, { timeout: 10000 })
			.click()
			.wait(waitFor)
			.then(() => {
				const page2 = [];
				cy.get(".ant-table-tbody>a.table-row", { timeout: 10000 }).each((tr) => {
					const name = tr.attr("data-row-key").toString();
					page2.push(name);
				});

				cy.then(() => {
					expect(page1).to.not.deep.equal(page2);
				});
			});
	}
);
