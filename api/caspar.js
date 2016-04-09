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
function _connect(cb) {
    if(_cg_connected) {
        return true;
    }

    ccg.connect(function () {
        ccg.on('connected', function () {
            _cg_connected = true;
            cb();
            return _cg_connected;
        });

        ccg.on('error', function() {
            _cg_connected = false;
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
        _connect(function() {
            if(_cg_connected) {
                res.status(200).json({success: true, message: 'Connection successful'});
            } else {
                res.status(503).json({success: false, message: 'Something went wrong. Connection could not be made.', serverconn: false});
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
        if(!_cg_connected) {
            res.status(503).json({success: false, message: 'Not connected to server.', serverconn: false});
        }

        var fields = req.body;
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
    router.post('/casparcg/stop', function(req, res) {
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server', serverconn: false});
        }

        var fields = req.body;
        ccg.stopTemplate(fields.channel);
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
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server'});
        }

        var fields = req.body;
        ccg.updateTemplateData('1-1', fields.inputs);
    });
};