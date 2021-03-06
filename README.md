## Project on hiatus

This project has been suspended until further notice.

-----------------

# EiliumWeb
### CasparCG Control Panel v. 0.0.4

HTML, CSS and JavaScript solution.

Built with AngularJS and Node.js making it lightweight and super fast. It includes a CasparCG Node.js library for communication (https://github.com/respectTheCode/node-caspar-cg) which I have not yet had the pleasure of testing completely.



**Requirements**

- Node.js
- MySQL server

**Uses**

- express - Routing
- caspar-cg - CasparCG connection and data handling
- mysql - Database
- socket.io - Used for net events to emit disconnections etc. to AngularJS
- jsonwebtoken - Access tokens
- bcryptjs - Password encryption. Variation of node-bcrypt without dependencies.
- cookies - Passing access token in HTTP headers
- body-parser - Populates the request body
- underscore

**Installation**

- git clone https://github.com/OssiPesonen/EiliumWeb.git
- create a MySQL database and run the SQL commands in database.sql
- create config.js file from config.dist
- Set conn_port (localhost:conn_port), MySQL information and JSON Web Token secret
- Open project folder with cmd and write:
    - npm install
    - node server.js

**Directory structure**

- /api/ - All API routes splitted in separate files which work at http://localhost/api/
- /public/ - HTML public directory used as index.
    - /app/ - AngularJS controllers
    - /assets/ - CSS, fonts, images, js, HTML templates
- /templates/ - An example templates directory for CasparCG server with one test template

**Root files**

- config.dist - Change to config.js. Include here MySQL database address, username, password, database, json web token secret
- helpers.js - Includes helper functions which at this point only include a verification for POST content to check if all nescessary data exists
- package.json - Project information and dependencies
- server.js - Node.js start file

## Includes

#### User access control

A JSON web token based authentication for users.

Being a web app if you run this on a network, like at a LAN event, your hosting address may be discovered and if you are hooked on the same network as everyone else your control panel may be messed with.

I remember one event having to deal with such an issue on an unrelated web app which was used for showing information on a big screen. The IP address was clearly visible on a screen and had no access control.

Remember to disable registration afterwards.

#### Database connection

All inputs, configurations, hotkeys and possible entities will be saved to a MySQL database.

I might, in a later time, write small helper functions to handle data retrieval better.

#### Socket.io

All Net events such as connection, disconnection and errors are transported via socket.io to AngularJS which listens to these events. The events then flip the connection button and notifies you of connection status.

## Notes

**Monitoring code changes**

If you're like me you'd like to install `supervisor` to reboot Node so it implements newest changes to the code. Do not however run this while in production because if you make changes the connection to CasparCG will be lost and the application will not know this. Atleast for now.

**JSON Web Token**

Do not use this authentication method on a live environment without changing two things in cookie creation:

    httpOnly: true
    secure: true

A cookie passed without HTTPS protocol makes it vulnerable and httpOnly prevents client side script access. You might also want to insert an expiration for the token. I also havent had time to test this 100% for faults.


**Disabling authentication**

In case you  do not wish to log in to the app you can disable the authentication by commenting or removing out
the **resolve** and **auth** params from AngularJS routes in public/app.js

After this you need to alter the api/authorization.js _authorize variable to just include

    next();

Or you can remove the authorization.authorize middlewares from the API routes.

After this you can just go to /dashboard/ without needing to log in or change the index route to use dashboard template.

I will be building a configuration setting for this in the nearby future.


## To-Do

- Create a configuration variable to disable need to log in
- Configuration for CasparCG template directory path and hotkeys
- Create more responsive templates so you can use 1080p and 720p without having two sets
- Example entities (Players, Teams)
- Creating more templates
  - Countdown
  - Twitter
  - Integrate groups and playoffs to local tournaments system
  - Player presentation
  - Team presentation
  - End credits
  - Scoreboard
- Possible image upload and presentation in templates
- Reading media folder and playing videos

## Future updates

#### Dynamic template blocks

I am hoping to create in the near future a single configuration file where you can input all tabs, templates and fields.

    var Eilium = {
        tab: {
            name: 'Information',
            template: {
                name: 'Information',
                template_name: 'information',
                layer: 1,
                fields: [
                    {
                        name: 'f0',
                        label: 'First',
                        type: 'text'
                    },
                    {
                        name: 'f1',
                        label: 'Second',
                        type: 'text'
                    },
                     {
                        name: 'f2',
                        label: 'Third',
                        type: 'text'
                    }
                ]
            }
        }
    }
