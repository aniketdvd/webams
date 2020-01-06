const connection = require('./../db-conf/connect');
const query = require('./../db-conf/queries.json');

let pushTicket = (ticketid, reportingid, title, description, date, time, priority, status) => {
    let ticket = [
        [ticketid, reportingid, title, description, date, time, priority, status]
    ];
    connection.query(query.sqlPushTicket, [ticket], (err, result) => {
        if(err) {
            throw console.warn(err);
        }
        console.log("One ticket generated at " + date + " " + time);
    });
}

module.exports = {
    pushTicket
};