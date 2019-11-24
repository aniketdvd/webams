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

var res = [];
function getUsers() {
    const sqlGetUser = "SELECT * FROM customers";
    connection.query(sqlGetUser, function(err, result) {
        if(err) {
            throw console.warn(err);
        }
        res = result;
        console.log("::Updated users list::", res);
        return res;
    });
}

module.exports = {
    addUser,
    deleteUser,
    getUsers
};