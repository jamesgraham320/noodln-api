const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
});

function sendWelcomeText() {
  vonage.message.sendSms(from )
}

