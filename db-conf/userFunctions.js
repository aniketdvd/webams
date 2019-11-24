const connection = require('./connect');

function addUser(email, name, hashedPassword, role) {
    let credentials = [
        [email, name, hashedPassword, role]
    ];
    const sqlPushUser = "INSERT INTO customers (email, name, hashedPassword, role) VALUES ?";
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