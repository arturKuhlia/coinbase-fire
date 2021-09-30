const functions = require('firebase-functions');
const cors = require('cors')({ origin: '*' });

const { Client, Webhook, resources } = require('coinbase-commerce-node');
const coinbaseSecret = 'api-key';
Client.init(coinbaseSecret);

const { Charge } = resources;

exports.createCharge = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // TODO get real product data from database

    const chargeData = {
      name: 'Widget',
      description: 'Wiget',
      local_price: {
        amount: 19.99,
        currency: 'CAD',
      },
      pricing_type: 'fixed_price',
      metadata: {
        user: 'usr123',
      },
    };

    const charge = await Charge.create(chargeData);
    console.log(charge);

    res.send(charge);
  });
});

exports.webhookHandler = functions.https.onRequest(async (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers['x-cc-webhook-signature'];
  const webhookSecret = 'your-webhook-secret';

  try {
    const event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);

    if (event.type === 'charge:pending') {
       alert("user paid, but transaction not confirm on blockchain yet")
      
    }

    if (event.type === 'charge:confirmed') {
       alert("all good, charge confirmed")
     
    }

    if (event.type === 'charge:failed') {
       alert("charge failed or expired")
    }

    res.send(`success ${event.id}`);
    
  } catch (error) {
    functions.logger.error(error);
    res.status(400).send('failure!');
  }
});
