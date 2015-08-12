var fs = require('fs');
var exec = require('child_process').exec;
var files = fs.readdirSync('./');
files.forEach(function(file){
	if(file.indexOf('.png') > -1 && file != "icon.png"){
		console.log(file);
		exec('cp icon.png '+ file, function(a,b,c){console.log(a,b,c)});
	}
})
