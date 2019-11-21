const connection = require('./connect');

function addUser(email, hashedPassword, role) {
    const sqlPushUser = "INSERT INTO customers (client, passphrase, role) VALUES ?";
    connection.query(sqlPushUser, [credentials], function(err, result) {
        if(err) {
            throw err;
        }
        console.log(":::Credentials insertion success:::");
    });
}

function deleteUser() {

}

module.exports = {
    addUser,
    deleteUser
};