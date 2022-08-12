const Vonage = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
});

function sendWelcomeText() {
  const from = "12017408125";
  const to = "18478409601";
  const text = "A text message sent using the Vonage SMS API";
  vonage.message.sendSms(to, from, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
}

module.exports = { sendWelcomeText };
