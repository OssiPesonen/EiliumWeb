/**
 * Routes for CasparCG
 *
 * Includes routes test
 *
 * Function parameters:
 *  - router. Express router object
 *  - connection. MySQL connection object for queries
 *
 * Required:
 *  - casparcg      CasparCG Node.js library (https://github.com/respectTheCode/node-caspar-cg) for communication
 *
 */

var CasparCG = require('caspar-cg');
var ccg = new CasparCG("192.168.1.100", 5250);
var _cg_connected = false;

function _connect(callback) {
    ccg.connect(function () {
        ccg.on('connected', function () {
            _cg_connected = true;
            callback();
            return true;
        });

        ccg.on('error', function(error) {
            callback(error);
            return false;
        });

        ccg.on('end', function() {
            ccg.connect();
            return false;
        });
    });
}

function _disconnect() {
    ccg.disconnect();
    _cg_connected = false;
    return true;
}

module.exports = function(router, connection) {
    router.post('/casparcg/connect', function(req, res) {
        _connect(function(error) {
            if(_cg_connected) {
                res.status(200).json({success: true, message: 'Connection successful'});
            } else {
                res.status(401).json({success: false, message: error});
            }
        });
    });

    router.post('/casparcg/disconnect', function(req, res) {
        _disconnect();
        return res.status(200).json({success: true, message: 'Disconnected from server'});
    });

    router.post('/casparcg/play', function(req, res) {
        var fields = req.body;

        if(!_cg_connected) {
            return res.status(300).json({success: false, message: 'Not connected to server'});
        }

        ccg.loadTemplate(fields.channel, 'JS/' + fields.template, 1, fields.inputs);
    });

    router.post('/casparcg/stop', function() {
        if(!_cg_connected) {
            return false;
        }

        ccg.stopTemplate('1-1');
    });

    router.put('/casparcg/update', function(req, res) {
        var fields = req.body;

        if(!_cg_connected) {
            return res.status(300).json({success: false, message: 'Not connected to server'});
        }

        ccg.updateTemplateData('1-1', fields.inputs);
    });
};