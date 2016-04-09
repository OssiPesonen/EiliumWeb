# EiliumWeb
### CasparCG Control Panel v. 0.0.1

HTML, CSS and JavaScript solution.

Built with AngularJS and Node.js making it lightweight and super fast. This is merely a skeleton with only one working test template. It includes a CasparCG Node.js library for communication (https://github.com/respectTheCode/node-caspar-cg) which I have not yet had the pleasure of testing completely. At this point there is only one test element there to fire a test template.

**Requirements**

- Node.js
- MySQL server
- express - Routing
- caspar-cg - CasparCG connection library

**Uses**

- mysql - Database
- jsonwebtoken - Access tokens
- bcryptjs - Password encryption. Variation of node-bcrypt without dependencies.
- cookies - Passing access token in HTTP headers

**Installation**

- git clone git@project
- Open project folder with cmd and write:
    - npm install
    - node server.js

**Monitoring code changes**

If you're like me you'd like to install `supervisor` to reboot Node so it implements newest changes to the code. Do not however run this while in production because if you make changes the connection to CasparCG will be lost and the application will not know this. Atleast for now. I might create an event lists


**Directory structure**

- /api/ - All API routes splitted in separate files which work at http://localhost/api/
- /public/ - HTML public directory used as index.
    - /app/ - AngularJS controllers
    - /assets/ - CSS, fonts, images, js, HTML templates

**Root files**

- config.dist - Change to config.js. Include here MySQL database address, username, password, database, json web token secret
- helpers.js - Includes helper functions which at this point only include a verification for POST content to check if all nescessary data exists
- package.json - Project information and dependencies
- server.js - Node.js start file


## Includes

#### User access control

Being a web app if you run this on a network, like at a LAN event, your hosting address may be discovered and if you
are hooked on the same network as everyone else your control panel may be messed with. I remember one event
having to deal with such an issue on an unrelated web app which was used for showing information on a big screen.
The IP address was clearly visible on a screen and had no access control.

#### Database connection

All inputs, configurations, hotkeys and possible entities will be saved to a MySQL database. I went with MySQL instead
of MongoDB because it's more familiar to me. I might, in a later time, write small helper functions for this.

## Future updates

#### Dynamic template blocks

I am hoping to create in the near future a single configuration file where you can input all tabs, templates and fields.

    var Eilium: {
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