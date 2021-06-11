# Infinite Campus OAuth2 Token Tester

This simple script takes in a token URL, clientID, and clientSecret. It then fires off a client_credentials token request every 5 seconds and checks:

1. Does the response contain a token?
2. Is the token non-expired?

## Usage

```
node index.js https://myTokenEndpointHere myClientHere mySecretHere
```
