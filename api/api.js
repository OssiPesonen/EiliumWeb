var config = require('../config'); // get our config file

module.exports = function (router, connection) {
    router.get('/debug', function (req, res) {
        res.json(config.debug);
    });

    router.post('/save', function (req, res) {
        var inputs = req.body.inputs;

        connection.query("DELETE FROM fields");

        for (var template in inputs) {
            if (inputs.hasOwnProperty(template)) {
                for (var input in inputs[template]) {
                    if (inputs[template].hasOwnProperty(input)) {
                        connection.query("INSERT INTO fields " +
                            "(template, `key`, `value`) " +
                            "values " +
                            "(?, ?, ?)",
                            [ template, input, inputs[template][input] ], function (error, result) {
                                if (error) {
                                    console.log(error);
                                }
                            });
                    }
                }
            }
        }

        return res.status(200).json({success: true, message: ''});
    });

    router.get('/fields', function(req, res) {
            connection.query("SELECT template, `key`, `value` FROM fields", function(error, result) {
                if(error) {
                    return res.status(400).json({success: false, message: 'Something went wrong. ' + error});
                } else {
                    return res.status(200).json({success: true, fields: result});
                }
            });
    });
};