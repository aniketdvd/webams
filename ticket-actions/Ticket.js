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
    ticketDat = () => {
        return [
            this.clientEmail,
            this.clientName,
            this.title,
            this.description,
            this.date,
            this.time,
            this.priority,
            this.status
        ] 
    }
}

let reportingDate = () => {
    let da = new Date();
    /* Custom Date Formatting */
    return da.getDate() + '-' + da.getMonth() + '-' + da.getFullYear();
}

let reportingTime = () => {
    let ti = new Date();
    /* Custom Time formatting */
    return ti.getHours() + ':' + ti.getMinutes();
}

let id = () => {
    return Date.now().toString();
}

module.exports = {
    Ticket,
    reportingDate,
    reportingTime,
    id
};