# OAuth2 using the Authorization Code Flow

Shows an OAuth2 authorization code flow with a nodejs backend. See [Use an OAuth API Token With an Integration](https://success.mindtouch.com/Integrations/API/Authorization_Tokens/Use_an_OAuth_API_Token_With_an_Integration) for technical docs.

## Quick Start 🚀

Make a copy of `configExample.json` to `config.json` then update with [perquisites](https://success.mindtouch.com/Integrations/API/Authorization_Tokens/Use_an_OAuth_API_Token_With_an_Integration#Prerequisites).

```json
{
    "hostname": "// Hostname of site",
    "appHostname": "// hostname of this app (localhost does seem to be an issue with Chrome)",
    "authId": 1, // service provider id provided by support
    "clientID": "// OAuth2 Client Id",
    "clientSecret": "// OAuth2 Client Secret",
    "scope": "// Scopes (more can be added by support)",
    "port": 8080 // Host of this app
}
```

`node index.js`

Go to: [http://localhost:8080](http://localhost:8080)

## Resources

-   https://success.mindtouch.com/Integrations/API/Authorization_Tokens/Use_an_OAuth_API_Token_With_an_Integration

-   https://success.mindtouch.com/Integrations/API

-   https://success.mindtouch.com/Admin/Authentication/OpenID_Connect/OpenID_Connect_Relying_Party_Endpoints
