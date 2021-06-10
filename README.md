# Rainbow-Canvas (Web Frontend)
An r/Place clone.

## Dependencies
| Software | Version |
|:--------:|:-------:|
|  NodeJS  | > 14.15 |
**Discord OAuth2 Integration & MongoDB is required!**

# Configuration
Copy the `config.template.json` and rename it to `config.json`.
```json
{
    "server": {
        "port": 80                                              // Server Port
    },
    "meta": {
        "name": "Rainbow Canvas",                               // Web Page Name
        "info": "Take part on a big canvas - pixel by pixel!",  // Web Page Description
        "color": "#383961",                                     // Main Color Of Page
        "domain": "example.com",                                // Domain
        "protocol": "http"                                      // Protocol
    },
    "session": {
        "secret": "",                                           // CSRF Secret
        "key": "",                                              // CSRF Key
        "maxage": 60000                                         // CSRF Max Age
    },
    "database": {
        "url":""                                                // MongoDB URL
    },
    "discord_oauth":{
        "clientId": "",                                         // Discord Client ID
        "clientSecret": "",                                     // Discord Client Secret
        "redirectUri": "",                                      // Discord Redirect URL
        "loginUri": "",                                         // Discord Login URL
    }
}
```

# Startup
To start the webserver, use
```cmd
npm start
```