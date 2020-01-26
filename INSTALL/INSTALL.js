const fs = require('fs');

let initInstall = (dbHost, dbUser, dbPass, dbName) => {
    let writeStream = fs.createWriteStream("./.env", "utf-8");
    writeStream.write(
        "SESSION_SECRET=temp_session_secret"+
        "\nDB_HOST=" + dbHost+
        "\nDB_USER=" + dbUser+
        "\nDB_PASSWORD=" + dbPass+
        "\nDB_NAME=" + dbName  
    );
    console.log("\n\nInstalling WebAMS...");
    writeStream.close();
    console.log('Done!');
}

module.exports = {
    initInstall
}