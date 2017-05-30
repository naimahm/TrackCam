var http = require('http');
var express = require('express');
var piServo = require('pi-servo');
var piblaster = require('pi-blaster.js');
var Promise = require('es6-promise').Promise;

const app = express();
 
const tiltPin = 17, panPin = 18;
const defaultPan = 135, defaultTilt = 90;
var tilt = new piServo(tiltPin); 
var pan = new piServo(panPin);

app.use(express.static(__dirname));

 
//turn off, specified servo
app.get('/off', function(req, res) { 
	try{
		pan.open().then(function(){  
		  	pan.setDegree(defaultPan); // 0 - 180
			piblaster.setPwm(panPin, 0);
		});
		tilt.open().then(function(){  
		 	tilt.setDegree(defaultTilt); // 0 - 180
			piblaster.setPwm(tiltPin, 0);
		});		
		res.end('Servos have been shut down');
	}catch(e){
		res.end('Failed to shut servos down');		
	}
});

//turn off, specified servo
app.get('/off/:servo', function(req, res) { 
	try{
		var servo = req.params.servo;
		if(servo === "pan"){
			pan.open().then(function(){  
			  pan.setDegree(defaultPan); // 0 - 180
			});
			piblaster.setPwm(panPin, 0);

		}
		if(servo === "tilt"){
			tilt.open().then(function(){  
			  tilt.setDegree(defaultTilt); // 0 - 180
			});
			piblaster.setPwm(tiltPin, 0);
		}
		
		res.end('Servos have been shut down');
	}catch(e){
		res.end('Failed to shut servos down');		
	}
});

//pan/tilt to certain degree
app.get('/:servo/:degree', function(req, res) { 
	try{
		var servoParam = req.params.servo, degree = req.params.degree, servo = null;
		if(servoParam && degree){
			if(servoParam === "pan") servo = pan;
			if(servoParam === "tilt") servo = tilt;	
			servo.open().then(function(){  
			  servo.setDegree(degree); // 0 - 180
			});
		}
		res.end(servoParam+' servo set to '+degree);
	}catch(e){
		console.log("Serve moving failed", e);
		res.end(e);
	}
});

//404
app.get('*', function (req, res) {
     res.status(404).send('Nope');
});

// error handler
app.use(function (err, req, res, next) {
      if (req.xhr) {
          res.status(500).send('Oops, Something went wrong!');
      } else {
          next(err);
      }
});

app.listen(3000);
console.log('App Server running at port 3000');

