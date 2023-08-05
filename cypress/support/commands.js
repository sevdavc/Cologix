Cypress.Commands.add("login", () => {
  cy.session("session1", () => {
    cy.intercept("GET", "https://js.authorize.net/v1/AcceptCore.js", {
      statusCode: 200,
    }).as("authenticated");
    cy.visit("");
    cy.get('[data-componentid="login_fld_user_name"]').type(
      `${Cypress.env("username")}`
    );
    cy.get('[data-componentid="login_fld_user_password"]').type(
      `${Cypress.env("password")}`,
      { log: false }
    );
    cy.get('[data-componentid="button-1010"]').click();
    cy.wait("@authenticated");
    cy.wait(5000);
  });
});

Cypress.Commands.add("visitPage", (fixtureName) => {
  cy.fixture("Routes.json")
    .its(fixtureName)
    .then((data) => {
      cy.visit(data);
    });
});

//Single Connection Form
Cypress.Commands.add("singleConnectionForm", (form) => {
  //Connection name is entered
  cy.get("body").find('input[type="text"]').eq(1).type(form.name);
  //VLAN ID is entered
  cy.get("body").find('input[type="number"]').eq(0).type(form.VLANID);
  //Click on the validate button
  cy.get(".validate").click();
  //Success message
  cy.get(".success").should("be.visible");
  //Port location dropdown is clicked and Toronto option is selected
  if (form.location == "Toronto") cy.get('select[name="location"]').select(2);
  //Connection speed dropdown is clicked and 50 Mbps option is selected
  cy.get('select[name="connection-speed"]').select(form.speed);
  cy.get("body").find('input[type="text"]').eq(2).type(726781068157);
  cy.get('select[name="vlan-tagging"]').select(form.tagging);
  cy.get(
    ".pricing-container > :nth-child(1) > :nth-child(1) > .float-right"
  ).should("contain", form.price);
  cy.intercept("POST", "/cam/v1/validate-order").as("createConnection");
  cy.get('button[type="button"]').contains("Next ").click();
  cy.wait("@createConnection");
});

//Single Connection Details Page
Cypress.Commands.add("singleConnectionValueChecking", (list) => {
  cy.get('[data-testid="evc-csp-name"]').should("contain", list.cspName);
  cy.get('[data-testid="evc-speed"]').should("contain", list.speed);
  cy.get('[data-testid="evc-source-port-tagging"]').should(
    "contain",
    list.tagging
  );
  cy.get('[data-testid="evc-csp-values"]')
    .find("dd")
    .eq(0)
    .should("contain", list.portCode);
  cy.get('[data-testid="evc-csp-values"]')
    .find("dd")
    .eq(1)
    .should("contain", list.location);
  cy.get('[data-testid="evc-csp-values"]')
    .find("dd")
    .eq(2)
    .should("contain", "726781068157");
  cy.get('[data-testid="evc-requester-company"]').should(
    "contain",
    list.requesterCompany
  );
  cy.get('[data-testid="evc-requester-name"]').should(
    "contain",
    "Ziynet Basarir"
  );
  cy.get('[data-testid="evc-requester-phone"]').should(
    "contain",
    "+1 05147977332"
  );
  cy.get('[data-testid="evc-requester-email"]').should(
    "contain",
    "ziynet.basarir@cologix.com"
  );
  cy.get('[data-testid="evc-name"]').should("contain", "Test1");
  cy.get('[data-testid="evc-source-port-name"]').should(
    "contain",
    "Name: " + list.portName
  );
  cy.get('[data-testid="evc-source-port-id"]').should(
    "contain",
    "ID: " + list.portID
  );
  cy.get('[data-testid="evc-source-port-site-code"]').should(
    "contain",
    list.portCode
  );
  cy.get('[data-testid="evc-source-port-address"]').eshould(
    "contain",
    list.portAddress
  );
  cy.get('[data-testid="evc-source-port-vid"]').should("contain", list.portVID);
  cy.get('[data-testid="evc-pricing-value"]').should("contain", list.price);
  cy.get('[data-testid="evc-diagram-source-port-description"]').should(
    "contain",
    `${list.portName} (ID: ${list.portID}) `
  );
  cy.get('[data-testid="evc-diagram-source-port-location"]').should(
    "contain",
    list.portCode + " - " + list.portAddress
  );
  cy.get('[data-testid="evc-diagram-speed"]').should(
    "contain",
    "New " + list.speed + " EVC"
  );
  cy.get('[data-testid="evc-diagram-name-tagging"]').should(
    "contain",
    "Name: " + list.name + " | " + list.tagging
  );
  cy.get('[data-testid="evc-diagram-csp-name"]').should(
    "contain",
    list.cspName
  );
  cy.get('[data-testid="evc-diagram-csp-data"]').should(
    "contain",
    list.portCode + " - " + list.location
  );
});

Cypress.Commands.add("singleConnectionMainPageValueChecking", (list) => {
  cy.get('[data-testid="port-XC0264092-vxc-undefined"]').should("be.exist");
  cy.get('[data-testid="port-XC0264092-vxc-undefined"]')
    .find('[data-testid="evc-name"]')
    .should("contain", list.name);
  cy.get('[data-testid="port-XC0264092-vxc-undefined"]')
    .find('[data-testid="tile_tile_status_detail"]')
    .should("contain", list.status);
  if (list.status == "Added to Cart")
    cy.get('[data-testid="port-XC0264092-vxc-undefined"]')
      .find('[data-testid="tile_tile_status_detail"]')
      .should("have.css", "background-color", "rgb(245, 98, 0)");
  cy.get('[data-testid="port-XC0264092-vxc-undefined"]')
    .find('[data-testid="tile_speed"]')
    .should("contain", list.speed);
});

Cypress.Commands.add("cartListElementValue", (element) => {
  cy.get(`[data-testid="cart-item-${element.order}"]`).should("be.exist");
  cy.get('[data-testid="vxc-title-speed"]')
    .eq(element.order)
    .should("contain", "New " + element.speed);
  cy.get('[data-testid="vxc-title-destination-cloud"]')
    .eq(element.order)
    .should("contain", " to " + element.destinationCloud);
  cy.get('[data-testid="vxc-ctrl-edit"]').eq(element.order).should("be.exist");
  cy.get('[data-testid="vxc-name-value"]')
    .eq(element.order)
    .should("contain", element.name);
  cy.get('[data-testid="vxc-source-port-tagging-value"]')
    .eq(element.order)
    .should("contain", element.tagging);
  cy.get('[data-testid="vxc-source-port-vid-value"]')
    .eq(element.order)
    .should("contain", element.vid);
  cy.get('[data-testid="vxc-source-port-value"]')
    .eq(element.order)
    .should("contain", element.portName);
  cy.get('[data-testid="vxc-source-port-id-value"]')
    .eq(element.order)
    .should("contain", element.portID);
  cy.get('[data-testid="vxc-source-port-site-code-value"]')
    .eq(element.order)
    .should("contain", element.portCode);
  cy.get('[data-testid="vxc-source-port-address-value"]')
    .eq(element.order)
    .should("contain", element.pordAddress);
  cy.get('[data-testid="vxc-csp-site-code-value"]')
    .eq(element.order)
    .should("contain", element.portCode);
  cy.get('[data-testid="vxc-csp-market-city-value"]')
    .eq(element.order)
    .should("contain", element.marketCity);
  cy.get('[data-testid="vxc-csp-market-state-value"]')
    .eq(element.order)
    .should("contain", element.marketState);
  cy.get('[data-testid="vxc-price-mrc"]')
    .eq(element.order)
    .should("contain", element.price);
});

Cypress.Commands.add("cartListTotalPrice", (element) => {
  cy.get('[class="float-right"]').eq(0).should("contain", element.totalPrice);
  cy.get('[class="float-right"]').eq(1).should("contain", element.totalCharges);
});

Cypress.Commands.add("orderForm", (order) => {
  cy.get('[placeholder="My Order Name"]').type(order.name);
  cy.get('select[name="billing-address"]').select(1);
  cy.get('input[type="text"]').eq(1).type(order.purchaseOrder);
  cy.get('input[type="text"]').eq(2).type(order.ID);
  cy.get('input[type="checkbox"]').check();
  cy.get('button[type="button"]').contains(" Submit Order ").click();
});

Cypress.Commands.add("redundantConnectionForm", (form) => {
  //Connection name 1 is entered
  cy.get("body").find('input[type="text"]').eq(3).type(form.name1);
  //Connection name 2 is entered
  cy.get("body").find('input[type="text"]').eq(4).type(form.name2);
  //VLAN ID is entered
  cy.get("body").find('input[type="number"]').eq(0).type(form.VLANID1);
  cy.get("body").find('input[type="number"]').eq(1).type(form.VLANID2);
  //Click on the validate button
  cy.get(".validate").eq(0).click();
  cy.get(".validate").eq(1).click();
  //Success message
  cy.get(".success").eq(0).should("be.visible");
  cy.get(".success").eq(1).should("be.visible");
  //Port location dropdown is clicked and Toronto option is selected
  if (form.location == "Toronto") cy.get('select[name="location"]').select(2);
  //Connection speed dropdown is clicked and 50 Mbps option is selected
  cy.get('select[name="connection-speed"]').select(form.speed);
  cy.get("body").find('input[type="text"]').eq(2).type();
  cy.get('select[name="vlan-tagging"]').select(form.tagging);
  cy.get(
    ".pricing-container > :nth-child(1) > :nth-child(1) > .float-right"
  ).should("contain", form.price);
  cy.intercept("POST", "/cam/v1/validate-order").as("createConnection");
  cy.get('button[type="button"]').contains("Next ").click();
  cy.wait("@createConnection");
});

Cypress.Commands.add("redundantConnectionValueChecking", (list) => {
  cy.get('[data-testid="evc-redundant-name"]').should("contain", form.name);
  cy.get('[data-testid="evc-redundant-source-port-name"]').should(
    "contain",
    "Name: " + list.portName
  );
  cy.get('[data-testid="evc-redundant-source-port-id"]').should(
    "contain",
    "ID: " + list.portID
  );
  cy.get('[data-testid="evc-redundant-source-port-site-code"]').should(
    "contain",
    list.portCode
  );
  cy.get('[data-testid="evc-redundant-source-port-address"]').should(
    "contain",
    list.portAddress
  );
  cy.get('[data-testid="evc-redundant-source-port-vid"]').should(
    "contain",
    list.portVID
  );
  cy.get(
    '[data-testid="evc-diagram-redundant-source-port-description"]'
  ).should("contain", `${list.portName} (ID: ${list.portID}) `);
  cy.get('[data-testid="evc-diagram-redundant-source-port-location"]').should(
    "contain",
    list.portCode + " - " + list.portAddress
  );
  cy.get('[data-testid="evc-diagram-redundant-speed"]').should(
    "contain",
    "New " + list.speed + " EVC"
  );
  cy.get('[data-testid="evc-diagram-name-tagging"]').should(
    "contain",
    "Name: " + list.name + " | " + list.tagging
  );
  cy.get('[data-testid="evc-diagram-redundant-csp-name"]').should(
    "contain",
    list.cspName
  );
  cy.get('[data-testid="evc-diagram-redundant-csp-data"]').should(
    "contain",
    list.portCode + " - " + list.location
  );
});

Cypress.Commands.add("cartListRedundantElementValue", (list) => {
  cy.get('[data-testid="vxc-redundant-name-value"]').should();
});
