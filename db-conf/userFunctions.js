const connection = require('./connect');
const query = require('./queries.json');

let addUser = (id, email, name, hashedPassword, role) => {
    let credentials = [
        [id, email, name, hashedPassword, role]
    ];
    connection.query(query.sqlPushUser, [credentials], function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        console.log(":::Credentials insertion success:::");
    });
}

module.exports = {
    addUser
};