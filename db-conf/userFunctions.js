const connection = require('./connect');

function addUser(id, email, name, hashedPassword, role) {
    let credentials = [
        [id, email, name, hashedPassword, role]
    ];
    const sqlPushUser = "INSERT INTO customers (id, email, name, hashedPassword, role) VALUES ?";
    connection.query(sqlPushUser, [credentials], function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        console.log(":::Credentials insertion success:::", result);
    });
}

module.exports = {
    addUser
};