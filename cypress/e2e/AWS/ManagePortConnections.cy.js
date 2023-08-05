describe("Tests1", () => {
  beforeEach(() => {
    cy.login();
    //Visit the Manage Port Connections page
    cy.visitPage("ManagePortConnectionsPage");
    //Click on the Connection button of TOR1
    cy.get('[data-testid="add-connection-button"]')
      .should("be.visible")
      .click();
    //Cloud Connection is selected
    cy.get("#new-connection-overlay > :nth-child(2)")
      .should("be.visible")
      .click();
    //AWS Direct Connect is selected
    cy.get("body").contains("AWS Direct Connect").click();
  });
  it("Single Connection", () => {
    //Single Connection is selected
    cy.get('button[type="button"]').contains("Single Connection").click();
    //TOR1 is selected as the source port
    cy.get('[style=""] > :nth-child(2) > :nth-child(1)').click();
    cy.singleConnectionForm({
      name: "test1",
      VLANID: 123,
      location: "Toronto",
      speed: "50 Mbps",
      tagging: "Single Tagged",
      price: "$90.00",
    });
    cy.singleConnectionValueChecking({
      cspName: "AWS Direct Connect",
      speed: "50 Mbps",
      tagging: "Single Tagged",
      portCode: "TOR1",
      location: "Toronto, Ontario",
      requesterCompany: "Anonymous - CAN",
      name: "Test1",
      portName: "TOR1Test2",
      portID: "XC0264091",
      portAddress: "151 Front Street West",
      portVID: "123",
      price: "$90.00",
    });
    cy.get('button[type="button"]').contains("Add To Cart").click();
    cy.location("href").should(
      "include",
      "/accessmarketplace/index.html#/manage-ports-and-evcs"
    );
    cy.singleConnectionMainPageValueChecking({
      name: "Test1",
      status: "Added to Cart",
      speed: "50 Mbps",
    });
    cy.visitPage("ShoppingCardCheckout");
    cy.cartListElementValue({
      order: 0,
      speed: "50 Mbps",
      destinationCloud: "AWS Direct Connect",
      name: "Test1",
      tagging: "Single Tagged",
      vid: "123",
      portName: "TOR1Test2",
      portID: "XC0264091",
      portCode: "TOR1",
      portAddress: "151 Front Street West",
      marketCity: "Toronto",
      marketState: "Ontario",
      price: "$90.00",
    });
    cy.cartListTotalPrice({
      totalPrice: "$90.00",
      totalCharges: "$0.00",
    });
    cy.orderForm({
      name: "testOrder",
      purchaseOrder: "testPurchaseOrder",
      ID: "testOrderID",
    });
    cy.location("href").should(
      "include",
      "/accessmarketplace/index.html#/manage-ports-and-evcs"
    );
    //Checking status of the order
  });

  it("Redundant Connection with One Port", () => {
    //Redundant Connection is selected
    cy.get('button[type="button"]').contains("Redundant Connection").click();
    cy.get('[class="ports-list"]').eq(1).contains("TOR1Test2").click();
    cy.get('button[type="button"]').contains("Next").click();
    cy.redundantConnectionForm({
      name1: "test1",
      name2: "test2",
      VLANID1: 123,
      VLANID2: 456,
      location: "Toronto",
      speed: "50 Mbps",
      tagging: "Single Tagged",
      price: "$180.00",
    });
    cy.singleConnectionValueChecking({
      cspName: "AWS Direct Connect",
      speed: "50 Mbps",
      tagging: "Single Tagged",
      portCode: "TOR1",
      location: "Toronto, Ontario",
      requesterCompany: "Anonymous - CAN",
      name: "Test1",
      portName: "TOR1Test2",
      portID: "XC0264091",
      portAddress: "151 Front Street West",
      portVID: "123",
      price: "$180.00",
    });
    cy.redundantConnectionValueChecking({
      name: "Test2",
      portName: "TOR1Test2",
      portID: "XC0264091",
      portAddress: "151 Front Street West",
      portVID: "456",
      portCode: "TOR1",
    });
    cy.get('button[type="button"]').contains("Add To Cart").click();
    cy.location("href").should(
      "include",
      "/accessmarketplace/index.html#/manage-ports-and-evcs"
    );
    cy.singleConnectionMainPageValueChecking({
      name: "Test1",
      status: "Added to Cart",
      speed: "50 Mbps",
    });
    cy.visitPage("ShoppingCardCheckout");
    cy.cartListElementValue({
      order: 0,
      speed: "50 Mbps",
      destinationCloud: "AWS Direct Connect",
      name: "Test1",
      tagging: "Single Tagged",
      vid: "123",
      portName: "TOR1Test2",
      portID: "XC0264091",
      portCode: "TOR1",
      portAddress: "151 Front Street West",
      marketCity: "Toronto",
      marketState: "Ontario",
      price: "$180.00",
    });
    cy.cartListRedundantElementValue({});
  });
});
