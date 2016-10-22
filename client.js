



var fetch = require('node-fetch');

fetch('http://127.0.0.1:8081/1')
    .then(function(res) {
        return res.text();
    }).then(function(body) {
        console.log(body);
    });



	
