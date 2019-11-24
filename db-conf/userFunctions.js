const connection = require('./connect');

function addUser(email, hashedPassword, role) {
    let credentials = [
        [email, hashedPassword, role]
    ];
    const sqlPushUser = "INSERT INTO customers (client, passphrase, role) VALUES ?";
    connection.query(sqlPushUser, [credentials], function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        console.log(":::Credentials insertion success:::", result);
    });
}

function deleteUser() {

}

function getUsers() {
    const sqlGetUser = "SELECT * FROM customers";
    connection.query(sqlGetUser, function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        console.log("::Updated users list::", typeof(result));
    });
}

module.exports = {
    addUser,
    deleteUser,
    getUsers
};