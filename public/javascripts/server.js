
/*
* 			INTEGRANTES:
*
*	ALEXANDRA AGUILAR NAJERA	304780037
*	MASSIEL MORA RODRIGUEZ		604190071
* 	BRYHAN RODRIGUEZ MORA		115420325
*	JEAN CARLO VARGAS ZUÑIGA	402220474
*/


//cargamos el package express y creamos nuestra app
var express = require('express');
var app = express();
var path = require('path');


//-------Mongo---------------
  
var mongoose = require('mongoose');
var db = mongoose.createConnection( 'mongodb://localhost:27017/primer_base');
var userSchema ;
//-------------------------

let N;
let entrada;
let salida;


//enviamos nuestro archivo index.html al usuario como página de inicio
app.get('/index.html', function(req, res){
	if(!userSchema)
		inicializaSchema();// ---------Mongo----------
 res.sendFile(path.join(__dirname + '/../../views/index.html'));
	console.log("Solicitud de Pagina atendida...");
 });
 
 app.get('/crearLab', function(req, res){
		N = req.query.dificultad || 10;
		generarLaberinto()
		.then( m => { let a = { N:N , E:entrada , S:salida , laberinto:m , camino:[] };return a;})
		.then( obj => JSON.stringify(obj))
		.then( json => res.json(json))
		.catch(err => console.log("Ha ocurrido un error al Parsear Lab " + err));
	
	console.log("Solicitud de Laberinto atendida...N=" + N);
 });
 
 app.get('/public/javascripts/Point.js', function(req, res){
		res.sendFile(path.join(__dirname + '/Point.js'));
	console.log("Solicitud de Point atendida...");
 });
 
  app.get('/public/javascripts/View.js', function(req, res){
		res.sendFile(path.join(__dirname + '/View.js'));
	console.log("Solicitud de View atendida...");
 });
 
  app.get('/public/javascripts/Model.js', function(req, res){
		res.sendFile(path.join(__dirname + '/Model.js'));
	console.log("Solicitud de Model atendida...");
 });
 
  app.get('/public/javascripts/Controller.js', function(req, res){
		res.sendFile(path.join(__dirname + '/Controller.js'));
	console.log("Solicitud de Controller atendida...");
 });

    app.get('/public/javascripts/demo.js', function(req, res){
		res.sendFile(path.join(__dirname + '/demo.js'));
	console.log("Solicitud de demo.js atendida...");
 });
   app.get('/public/javascripts/jquery-1.7.1.min.js', function(req, res){
		res.sendFile(path.join(__dirname + '/jquery-1.7.1.min.js'));
	console.log("Solicitud de jquery-1.7.1.min atendida...");
 }); 
  app.get('/public/stylesheets/demo.css', function(req, res){
		res.sendFile(path.join(__dirname + '/../stylesheets/demo.css'));
	console.log("Solicitud de demo.css atendida...");
 }); 
 
 app.get('/public/images/error', function(req, res){
		res.sendFile(path.join(__dirname + '/../sounds/error.mp3'));
	console.log("Solicitud de sound error atendida...");
 });
  app.get('/public/images/paso', function(req, res){
		res.sendFile(path.join(__dirname + '/../sounds/paso.mp3'));
	console.log("Solicitud de sound paso atendida...");
 });
 
//iniciamos el servidor
app.listen(1337,'127.0.0.1');
console.log('¡Server corriendo sobre el puerto 1337!');
// POST----
let bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
  
  app.post('/guardarJuego', function(req, res){
		let usr = req.body.nick;
		let lab = req.body.data;
		console.log("Guardando..." + usr);
		User.update({nick:usr},{$set:{data:lab}},{upsert:true},function(err,doc){
			if(err) console.log("Error guardando...");
			});
	res.send("jugador guardado " + usr);
});

app.get('/recuperarJuego', function(req, res){
	let r = req.query.nick;
	console.log("Pidiendo Recuperar laberinto" + r);
	User.find({nick:r},function(err,doc){
		if(err) console.log("Ha ocurrido un error.... recuperarJuego");
		res.json(doc[0].data);	
	});
});

function inicializaSchema(){
	userSchema	= mongoose.Schema({
		nick : { type : String, trim : true , unique : true },
		data : { type : String, trim : true}
	});
	User = db.model('users', userSchema);
	//----------------------------------------------
}

function rnd(n){
	return Math.floor(Math.random()*n);
}


	function marcarES(){
		entrada = rnd(N);
		salida = rnd(N);
		laberinto[0][entrada].a = 0; // entrada
		laberinto[N-1][salida].ab = 0; // salida
		return laberinto;
	}

	function generar(){
		laberinto = Array.from({length:N},(_,e) => Array.from({length:N}, (_,k) => {return {d:1,i:1,a:1,ab:1,v:0};}));
		return laberinto;
	}
 function generarLaberinto()
  {
	return Promise.resolve(generar())
		.then( lab => MakeLab(lab))
		.then(_ => marcarES())
		.catch(err =>console.log('Error al crear ', err));
  }
  
   function impMat(m)
  {
		for(let i=0;i<N;i++)
		{
			var txt =" ";
			for(let j=0;j<N;j++)
				txt += " D: " + m[i][j].d;
			console.log(txt);		
		}
			
  }
  
  function moverDerecha(fil,col,mat,recursivo)
  {
	mat[fil][col].d = 0;
	mat[fil][col+1].i = 0;
	recursivo(mat,fil,col+1);  
  }
  
  function moverIzquierda(fil,col,mat,recursivo)
  {
	mat[fil][col].i = 0;
	mat[fil][col-1].d = 0;
	recursivo(mat,fil,col-1);
  }
  
  function moverArriba(fil,col,mat,recursivo)
  {
	mat[fil][col].a = 0;
	mat[fil-1][col].ab = 0;
	recursivo(mat,fil-1,col);
  }
  
  function moverAbajo(fil,col,mat,recursivo)
  {
	mat[fil][col].ab = 0;
	mat[fil+1][col].a = 0;
	recursivo(mat,fil+1,col);
  }
  
  
   function MakeLab(mat)
  {
	let recursivo = function(mat,fil,col)
	{
		//---------marcamos la posicion como visitada
		mat[fil][col].v = 1;
		let pos = [0,1,2,3];
		//---------Elegimos un vecino que no este visitado
		
		while(pos.length > 0)
		{
			let opc = rnd(pos.length);
			switch(pos[opc])
			{
			case 0: //arriba
				(fil > 0 && mat[fil-1][col].v == 0) ? moverArriba(fil,col,mat,recursivo) : true;
				break;
			case 1:  //derecha
				(col < N-1 && mat[fil][col+1].v == 0)? moverDerecha(fil,col,mat,recursivo) : true;
				break;
			case 2: //izquierda
				(col > 0 && mat[fil][col-1].v == 0) ? moverIzquierda(fil,col,mat,recursivo) : true;
				break;
			case 3:   //abajo
				(fil < N-1 && mat[fil+1][col].v == 0)? moverAbajo(fil,col,mat,recursivo) : true;
				break;
			}
			pos.splice(opc,1); // elimina el valor seleccionado del array		
		}
		return mat;
	}
	
	return recursivo(mat,rnd(N),rnd(N));
  }
  