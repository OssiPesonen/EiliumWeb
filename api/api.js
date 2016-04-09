var config = require('../config'); // get our config file

module.exports = function(router, connection) {
    router.get('/debug', function(req, res) {
        res.json(config.debug);
    });
};