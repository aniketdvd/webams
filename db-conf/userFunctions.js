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
    const sqlGetUsers = "SELECT * FROM customers";
    connection.query(sqlGetUsers, function(err, result) {
        if(err) {
            throw err
        }
        console.log("Users object updated", result);
        return result;
    });
}

module.exports = {
    addUser,
    deleteUser,
    getUsers
};