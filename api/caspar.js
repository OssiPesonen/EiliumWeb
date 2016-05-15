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
var authorization = require('./authorization');

module.exports = function(router, connection, socket) {
    /**
     * Route: connect
     * Path: /api/casparcg/connect/
     *
     * Attempts to connect to a CasparCG server
     *
     * Returns either a success code (200), or an error code 503 and message.
     */
    router.post('/casparcg/connect', authorization.authorize, function(req, res) {
        if(_cg_connected) {
            socket.emit('serverConnected', {message: 'You have already connected', server_conn: true });
            return res.status(200);
        }

        ccg.connect(function () {
            res.status(200).json({success: true, message: 'Attempting to connect..'});
        });
    });

    router.get('/casparcg/is_connected',  authorization.authorize, function(req, res) {
        if(_cg_connected) {
            return res.status(200).json({success: true, message: 'Already connected'});
        } else {
            return res.status(503).json({success: false, message: 'Not connected'});
        }
    });

    /**
     * Route: disconnect
     * Path: /api/casparcg/disconnect/
     *
     * Disconnects from CasparCG server
     *
     * Returns a success code (200) and message
     */
    router.post('/casparcg/disconnect', authorization.authorize, function(req, res) {
        ccg.disconnect();
        _cg_connected = false;
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
    router.post('/casparcg/play',  authorization.authorize, function(req, res) {
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server.', serverconn: false});
        }

        var fields = req.body;

        if(fields.template == 'groups' || fields.template == 'brackets') {
            ccg.customCommand('MIXER 1 MASTERVOLUME 0');
            ccg.customCommand('MIXER 1-1 OPACITY 0');
            ccg.play('1-1','lantrek_final', {loop: true, transition: 'easein'});
            ccg.customCommand('MIXER 1-1 OPACITY 1 30 EASEINSINE');
        }

        ccg.loadTemplate(fields.channel, 'JS/' + fields.template, 1, fields.inputs, function(response) {
            if(response instanceof Error) {
                return res.status(400).json({success: false, message: response.message});
            } else {
                return res.status(200).json({success: true, message: 'Template in layer ' + fields.channel + ' loaded and played'});
            }
        });
    });

    /**
     * Route: stop
     * Path: /api/casparcg/stop/
     *
     * Stops a template in given channel and layer
     * Request body example: { channel: '1-1' }
     *
     */
    router.post('/casparcg/stop',  authorization.authorize, function(req, res) {
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server', serverconn: false});
        }


        var fields = req.body;
        ccg.stopTemplate(fields.channel, function(response) {
            if(response instanceof Error) {
                return res.status(400).json({success: false, message: response.message});
            } else {
                ccg.customCommand('MIXER 1-1 OPACITY 0 30 EASEINSINE');
                setTimeout(function() {
                 ccg.customCommand('MIXER 1 MASTERVOLUME 1');
                 ccg.stop('1-1');
                 ccg.customCommand('MIXER 1-1 OPACITY 1 ');
                }, 1000);

                return res.status(200).json({success: true, message: 'Template in layer ' + fields.channel +' stopped'});
            }
        });
    });

    /**
     * Route: clear
     * Path: /api/casparcg/clear/
     *
     * Clears a given channel
     * Request body example: { channel: '1-1' }
     *
     */
    router.post('/casparcg/clear',  authorization.authorize, function(req, res) {
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server', serverconn: false});
        }

        var fields = req.body;
        ccg.clear(fields.channel, function(response) {
            if(response instanceof Error) {
                return res.status(400).json({success: false, message: response.message});
            } else {
                return res.status(200).json({success: true, message: 'Channel cleared'});
            }
        });
    });

    /**
     * Route: update
     * Path: /api/casparcg/update/
     *
     * Updates a template in given channel with given inputs
     * Request body example: { channel: '1-1', inputs: { f0: 'First', f1: 'Second', f2: 'Third } }
     *
     */
    router.put('/casparcg/update', authorization.authorize,  function(req, res) {
        if(!_cg_connected) {
            return res.status(503).json({success: false, message: 'Not connected to server'});
        }

        var fields = req.body;
        ccg.updateTemplateData(fields.channel, fields.inputs);
        return res.status(200).json({success: true, message: 'Template updated'});
    });

    /**
     * TCP "listeners" for emitted events by caspar-cg.
     * For each listener there is a socket emit which  are listened by AngularJS
     * These determine if a connection has been gained or lost
     * */
    ccg.on('connected', function () {
        _cg_connected = true;
        socket.emit('serverConnected', {message: 'You have connected', server_conn: true});
    });

    ccg.on('error', function (error) {
        _cg_connected = false;
        socket.emit('serverDisconnected', {message: 'Server connection failed. Error: ' + error, server_conn: false});
    });

    ccg.on('connectionError', function (error) {
        _cg_connected = false;
        socket.emit('serverDisconnected', {message: 'Server connection failed. Error: ' + error, server_conn: false});
    });

    ccg.on('disconnected', function () {
        _cg_connected = false;
        socket.emit('serverDisconnected', {message: 'Disconnected.', server_conn: false});
    });

    ccg.on('end', function () {
        _cg_connected = false;
        socket.emit('serverDisconnected', {message: 'Connection ended', server_conn: false});
    });

    ccg.on('close', function () {
        _cg_connected = false;
        socket.emit('serverDisconnected', {message: 'Connection closed', server_conn: false});
    });
};