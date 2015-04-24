
var mssql = require('mssql');

var config = {
    user:       'dzhao',
    password:   'dzhao',
    port:       1433,
    server:     'localhost',
    database:   'myDb'
};

exports.findAll = function (queryStr, callback){
    mssql.connect(config, function(err){
        console.log("start connect...");
        if(err){
            console.error("connect error " + err.message);
            callback(null); 
        }else{
            console.log("start request ...");
            var request = new mssql.Request();
            request.query(queryStr, function(err, recordset){
                console.log("start query ...");                
                if(err){
                    console.error(err.message)
                    callback(null); 
                }else{              	
                    callback(recordset);                    
                }
            });
        }
    });
};

exports.execute = function (queryStr, callback){
    mssql.connect(config, function(err){
        console.log("start connect...");
        if(err){
            console.error("connect error " + err.message);
            callback(null); 
        }else{
            console.log("start request ...");
            var request = new mssql.Request();
            request.query(queryStr, function(err, recordset){
                console.log("start query ...");
                if(err){
                    console.error(err.message);
                    callback(null); 
                }else{              	
                    callback(recordset);                    
                }
            });
        }
    });
};





