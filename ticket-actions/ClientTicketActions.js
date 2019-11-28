const connection = require('./../db-conf/connect');

let pushTicket = (clientEmail, clientName, title, description, date, time, priority, status) => {
    let ticket = [
        [clientEmail, clientName, title, description, date, time, priority, status]
    ];
    const sqlPushTicket = " "; /* Add query */
    connection.query(sqlPushTicket, [ticket], (err, result) => {
        if(err) {
            throw console.warn(err);
        }
        console.log("::Ticket was reported successfully::");
    })
}

module.exports = {
    pushTicket
};