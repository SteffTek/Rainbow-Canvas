# Rainbow-Canvas (Web Frontend)
An r/Place clone.

### Other parts of this project:
[**Rainbow TimeLapse**](https://github.com/SteffTek/Rainbow-Timelapse) - Generate a time lapse from rainbow data.

[**Rainbow Heatmap**](https://github.com/SteffTek/Rainbow-Heatmap) - Generate a heat map from rainbow data.

[**Rainbow Score**](https://github.com/SteffTek/Rainbow-Score) - Calculate which users have the most pixels placed.

**Rainbow Server** - The heart&logic of Rainbow Canvas. Provides logic and administration. _Still needs cleanup_

All sub-projects have the same requirements as this main project.

### Dependencies
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