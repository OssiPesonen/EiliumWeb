/**
 * Helper functions
 */

module.exports = {
    /**
     * Verifies if required fields exist in request and returns status true or false
     *
     * @param required - Required fields as array ['field','field' .. ]
     * @param post - Pass your POST values here from route req.body that you want to verify exist
     * @returns {*}
     */
    verifyRequestParams: function(required, post) {
        var error = false,
            response,
            error_fields = '';

        required.forEach(function(field) {
            if(post[field] === undefined) {
                error = true;
                error_fields += field + ', ';
            }
        });

        if(error) {
            response = {'status': false, 'message': 'Required field(s) ' + error_fields + ' is missing or empty'};
        } else {
            response = {'status': true, 'message': ''};
        }

        return response;
    }
};