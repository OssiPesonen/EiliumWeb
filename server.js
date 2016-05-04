var express         = require('express');
var mysql           = require('mysql');
var bodyParser      = require('body-parser');
var io              = require('socket.io');
var config          = require('./config');
var app             = express();

function API(){
    var self = this;
    self.connectMysql();
}

API.prototype.connectMysql = function() {
    var self = this;

    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host            : config.mysql_host,
        user            : config.mysql_user,
        password        : config.mysql_password,
        database        : config.mysql_database
    });

    pool.getConnection(function(err,connection){
        if(err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
};

API.prototype.configureExpress = function(connection) {
    var self = this;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    /* Router and route files */

    var router = express.Router();
    app.use('/api', router);

    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    var server = app.listen(config.conn_port, function(){
        console.log("Eilium launched at port " + config.conn_port);
    });

    io = io.listen(server);

    require('./api/api')(router, connection);
    require('./api/users')(router, connection);
    require('./api/caspar')(router, connection, io);
};

API.prototype.stop = function(err) {
    console.log("An issue occurred : " + err);
    process.exit(1);
};

new API();

app.use(express.static(__dirname + '/public'));
