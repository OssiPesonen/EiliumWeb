/**
 * Routes for CasparCG
 *
 * Includes routes connect, disconnect, play, stop
 *
 * Function parameters:
 *  - router. Express router object
 *  - connection. MySQL connection object for queries
 *
 * Required:
 *  - caspar-cg      CasparCG Node.js library (https://github.com/respectTheCode/node-caspar-cg) for communication
 *
 */

var CasparCG = require('caspar-cg');
var ccg = new CasparCG("192.168.1.100", 5250);
var _cg_connected = false;

/**
 * Helper function for connection because it's used multiple times
 */
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

/**
 * Helper function for disconnection
 */
function _disconnect() {
    ccg.disconnect();
    _cg_connected = false;
    return true;
}

module.exports = function(router, connection) {

    /**
     * Route: connect
     * Path: /api/casparcg/connect/
     *
     * Connects to CasparCG server
     *
     * Returns either a success code (200), or an error code 503 and message.
     */
    router.post('/casparcg/connect', function(req, res) {
        _connect(function(error) {
            if(_cg_connected) {
                res.status(200).json({success: true, message: 'Connection successful'});
            } else {
                res.status(503).json({success: false, message: error});
            }
        });
    });

    /**
     * Route: disconnect
     * Path: /api/casparcg/disconnect/
     *
     * Disconnects from CasparCG server
     *
     * Returns a success code (200) and message
     */
    router.post('/casparcg/disconnect', function(req, res) {
        _disconnect();
        return res.status(200).json({success: true, message: 'Disconnected from server'});
    });

    /**
     * Route: play
     * Path: /api/casparcg/play/
     *
     * Plays a given template in given channel passing on data from inputs as object
     * Request body example: { channel: '1-1', template: 'information', inputs: { f0: 'First', f1: 'Second', f2: 'Third } }
     *
     */
    router.post('/casparcg/play', function(req, res) {
        var fields = req.body;

        // Has to be changed to handle not connected -> reconnect. Experienced problems on first test
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server'});
        }

        ccg.loadTemplate(fields.channel, 'JS/' + fields.template, 1, fields.inputs);
    });

    /**
     * Route: stop
     * Path: /api/casparcg/stop/
     *
     * Stops a template in given channel
     * Request body example: { channel: '1-1' }
     *
     */
    router.post('/casparcg/stop', function() {
        // Has to be changed to handle not connected -> reconnect. Experienced problems on first test
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server'});
        }

        // Change this to get channel from request
        ccg.stopTemplate('1-1');
    });

    /**
     * Route: update
     * Path: /api/casparcg/update/
     *
     * Updates a template in given channel with given inputs
     * Request body example: { channel: '1-1', inputs: { f0: 'First', f1: 'Second', f2: 'Third } }
     *
     */
    router.put('/casparcg/update', function(req, res) {
        var fields = req.body;

        // Has to be changed to handle not connected -> reconnect. Experienced problems on first test
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server'});
        }

        ccg.updateTemplateData('1-1', fields.inputs);
    });
};