const stripe = require("stripe")(
  "STRIPE_SECRET_KEY"
);
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

let endpointSecret = "YOUR_END_POINT_SECRET_KEY";
let session = "";

app.post(
  "/webhook/connect",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        session = event.data.object;
        console.log("completed=", session);
        // Then define and call a function to handle the event checkout.session.completed
        break;

      case "balance.available":
        session = event.data.object;
        // console.log("balance=", session);
        // Then define and call a function to handle the event checkout.session.completed
        break;

      case "charge.succeeded":
        session = event.data.object;
        // console.log("Charge=", session);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case "customer.created":
        session = event.data.object;
        // console.log("Customer=", session);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case "issuing_transaction.created":
        session = event.data.object;
        // console.log("Transaction Created=", session);``
        // Then define and call a function to handle the event checkout.session.completed
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.listen(5000, () => {
  console.log("api Listening to port 5000");
});
