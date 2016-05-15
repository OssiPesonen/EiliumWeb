var jwt     = require('jsonwebtoken');
var Cookies = require('cookies');
var config = require('../config');

var _authorize = function (req, res, next) {
    var token = new Cookies(req, res).get('access_token');

    if (!token) {
        res.cookie('access_token', '', {expires: new Date()});
        res.status(401).json({success: false, message: "No token verified. Access denied"});
    } else if (token) {
        jwt.verify(token, config.secret, function (error, decoded) {
            if (error) {
                error.message = error.message == 'jwt expired' ? 'Token expired. Please log in again' : error.message;
                res.status(401).json({success: false, message: error});
            } else {
                next();
            }
        });
    } else {
        res.cookie('access_token', '', {expires: new Date()});
        res.status(401).json({success: false, message: "Access denied for other reasons"});
    }
};

module.exports = {
    authorize: _authorize
};