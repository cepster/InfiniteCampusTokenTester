const axios = require("axios");
const qs = require("qs");

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const args = process.argv.slice(2);
const tokenURL = args[0];
const clientID = args[1];
const clientSecret = args[2];

if (!tokenURL || !clientID || !clientSecret) {
  console.error(
    "\x1b[31m",
    "Please supply a tokenURL, clientID, and clientSecret.  Format: 'node index.js tokenURL myClientID myClientSecret"
  );
  process.exit(0);
}

const auth = Buffer.from(clientID + ":" + clientSecret).toString("base64");

const options = {
  method: "POST",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + auth,
  },
  data: qs.stringify({
    grant_type: "client_credentials",
  }),
  url: tokenURL,
};

setInterval(() => {
  axios(options)
    .then((response) => {
      if (!response.data || !response.data["access_token"]) {
        console.error("\x1b[31m", "Got invalid or null access token!");
        process.exit(0);
      } else {
        const token = response.data["access_token"];
        const payload = token.split(".")[1];
        const decodedPayload = Buffer.from(payload, "base64").toString("ascii");
        const expiration = JSON.parse(decodedPayload).exp;

        if (expiration < (Date.now() + 14000) / 1000) {
          console.error(
            "\x1b[31m",
            "Got an invalid expiration on this access token"
          );
          process.exit(0);
        }

        console.log("\x1b[32m", "Token Looks Good");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}, 5000);
