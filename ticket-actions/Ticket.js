class Ticket {
    constructor(
        reportingClientEmail, 
        reportingClientName, 
        title, 
        description, 
        reportingDate, 
        reportingTime, 
        priority, 
        status
    ){
        this.clientEmail = reportingClientEmail;
        this.clientName = reportingClientName;
        this.title = title;
        this.description = description;
        this.date = reportingDate;
        this.time = reportingTime;
        this.priority = priority;
        this.status = status;
    }
}

let reportingDate = () => {
    let da = new Date();
    /* Custom Date Formatting */
    return da.getDate() + '-' + da.getMonth() + '-' + da.getFullYear();
}

let reportingTime= () => {
    let ti = new Date();
    /* Custom Time formatting */
    return ti.getHours() + ':' + ti.getMinutes();
}

module.exports = {
    Ticket,
    reportingDate,
    reportingTime
};