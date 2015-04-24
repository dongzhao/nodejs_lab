var express	=	require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan'); 
//var methodOverride = require('method-override');
var database = require("./modules/mssql-database-module");
var router = express.Router();
var app		=	express();

//app.set("port", process.env.PORT || 9062);

	app.use(express.static(__dirname + '/public')); 
	app.use(morgan('dev')); 
	app.use(bodyParser.urlencoded({ extended : false })); 
	app.use(bodyParser.json());
	//app.use(bodyParser.json({ type: 'application/vnd.api+json' }));	
	app.use(bodyParser.json({ type: 'application/json' }));
	//app.use(methodOverride);
	app.use(router);

app.listen(9062);

console.log("App listening on port 9062");

//routes
app.get('/api/user/list', function(req, res) {
	  //res.render(index.html);
	database.findAll('select * from my_user', function(result){        
        console.log('################ results1: #####################');  
        console.dir(result);
        res.json(result);
    });		  
});

app.get('/api/user/list/:user_id', function(req, res) {
	  var user_id = req.params.user_id;
	  res.json('User is ' + user_id); 
	});

app.post('/api/user/add', function(req, res) {	  
	  console.log(req.headers);
	  console.log(req.body);
	  
	  var user = req.body;
	  console.log('user name: ' + user.user);
	  console.log('user password: ' + user.password);
	  
	  var sql = "select user_name from my_user where user_name = '" + user.user + "'";
	  database.execute(sql, function(results){
	        console.log('################ results: #####################');  
	        console.dir(results);		  
		  	if(results.length < 1){
		  	  var sql = "insert into my_user(user_name, password) values('" + user.user + "', '" + user.password + "')";			  
			  database.execute(sql, function(result){        
			        console.log('################ results1: #####################');  
			        console.dir(result);
			        res.json(result);
			    });			  		
		  	}else{
		  		res.json("User has already exist.");
		  	}	       
	    });		  	  	  
	});

app.post('/api/user/edit', function(req, res) {	  
	  console.log(req.headers);
	  console.log(req.body);
	  
	  var user = req.body;
	  console.log('user name: ' + user.user);
	  console.log('user password: ' + user.password);
	  
	  var sql = "update my_user set password = '" + user.password + "' where user_name = '" + user.user + "'";
	  database.execute(sql, function(results){	  	 
		  	res.json("success!");
	   });		  	  	  
	});

app.post('/api/user/delete', function(req, res) {	  
	  console.log(req.headers);
	  console.log(req.body);
	  
	  var user = req.body;
	  console.log('user name: ' + user.user);
	  
	  var sql = "delete from my_user where user_name = '" + user.user + "'";
	  database.execute(sql, function(results){
		  res.json("success!");
	   });		  	  	  
	});


app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});


