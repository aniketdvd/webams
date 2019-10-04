const http = require('http');
const path = require('path');
const fs = require('fs');

fs.readFile('./_index.html', function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
});

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(req.url === '/'){
        res.write(index);
        res.end();
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log('Server running on', PORT));