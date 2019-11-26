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

module.exports = Ticket;