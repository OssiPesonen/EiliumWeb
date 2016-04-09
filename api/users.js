/**
 * Routes for User controller
 *
 * Includes routes root, login, register, logout
 *
 * Function parameters:
 *  - router. Express router object
 *  - connection. MySQL connection object for queries
 *
 * Required:
 *  - jsonwebtoken  Creates a JSON web token from a given payload to pass to a cookie.
 *                  This token is then validated in every AngularJS route request to make sure user is logged in.
 *  - bcrypt        Encrypts passwords when registering a new account
 *  - cookies       Creates cookies to be passed in HTTP headers to be passed during each request.
 *                  Used to pass access token to validate request and make sure user is logged.
 *                  Note: If you are running a live environment change cookie parameters httpOnly and secure to true.
 *                        A cookie passed in a non-SSL protected environment is vulnerable
 *
 */

var jwt    = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Cookies = require('cookies');

var config = require('../config');
var helpers = require('../helpers');

module.exports = function(router, connection) {
    /**
     * Route: root
     * Path: /api/users/
     *
     * Called by AngularJS authResolver to ensure user is logged and his access token has not expired.
     */
    router.get('/users/', function(req, res) {
        var token = new Cookies(req,res).get('access_token');

        if(!token) {
            res.cookie('access_token', '', { expires: new Date()});
            res.status(401).json({success: false, message: "No token verified. Access denied"});
        } else if(token) {
            jwt.verify(token, config.secret, function(error, decoded) {
                if(error) {
                    error.message = error.message == 'jwt expired' ? 'Token expired. Please log in again' : error.message;
                    res.status(401).json({ success: false, message: error });
                } else {
                    res.status(200).json({success: true, message: "Token exists. Successful login"});
                }
            });
        } else {
            res.cookie('access_token', '', { expires: new Date()});
            res.status(401).json({success: false, message: "Access denied for other reasons"});
        }
    });

    /**
     * Route: login
     * Path: /api/users/login/
     *
     * Takes in POST values and attempts to find a user with given username (email).
     * If the user is found, his password is then checked against the password given
     * in POST request with bcrypt. If the password is correct a JSON web token is created
     * with user information as payload and a cookie 'access_token' to be passed in every
     * HTTP request.
     *
     * Returns either a success code (200), user_id and email, or an error code 401.
     */
    router.post('/users/login', function(req, res) {
        var user = req.body.user;
        var verify = helpers.verifyRequestParams(['email','password'], user);

        if(verify.status === false) {
            res.status(400).json({"message:": verify.message});
        } else {
            connection.query("SELECT id, password, email, created FROM users WHERE email = ?", [user.email], function(error, result) {
                if(error) {
                    res.status(401).json({success: false, message: "You have not registered as a user"});
                } else {
                    result = result[0];
                    if(bcrypt.compareSync(user.password, result.password)) {
                        var payload = {id: result.id, email: result.email, created: result.created};

                        var token = jwt.sign(payload, config.secret);

                        new Cookies(req, res).set('access_token', token, { httpOnly: false, secure: false });

                        res.status(200).json({
                            success   : true,
                            message   : "Successfully logged in",
                            "email"     : result.email,
                            "user_id"   : result.id
                        });
                    } else {
                        res.status(401).json({success: false, message: "Invalid password"});
                    }
                }
            });
        }
    });

    /**
     * Route: logout
     * Path: /api/users/logout/
     *
     * Checks if a cookie 'access_token' exists and clears it
     *
     * Returns a success code (200) in every case
     */
    router.post('/users/logout', function(req, res)  {
        var token = new Cookies(req,res).get('access_token');

        if(token) {
            res.cookie('access_token', '', { expires: new Date()});
        }

        res.status(200).json({success: true, message: "You have successfully logged out"});
    });

    /**
     * Route: register
     * Path: /api/users/register/
     *
     * Checks if a cookie 'access_token' exists and clears it
     *
     * Returns a success code (200) in every case
     */
    router.post('/users/register', function(req, res)  {
        var user = req.body.user;
        var verify = helpers.verifyRequestParams(['email','password'], user);

        if(verify.status === false) {
            res.status(400).json({"message:": verify.message});
        } else {
            var exists = true;

            connection.query("SELECT id FROM users WHERE email = ?", [user.email], function(error, result) {
                exists = result.length > 0;
            });

            if (exists) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(user.password, salt);
                connection.query("INSERT INTO users (email, password, created) values (?, ?, NOW())", [user.email, hash ], function (error, result) {
                    if (error) {
                        res.status(400).json({success: false, message: "Error occurred executing query"});
                    } else {
                        res.status(200).json({success: true, message: "User created"});
                    }
                });
            } else {
                res.status(400).json({success: false, message:"Aborted"});
            }
        }
    });
};