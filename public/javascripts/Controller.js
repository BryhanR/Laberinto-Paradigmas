
/*
* 			INTEGRANTES:
*
*	ALEXANDRA AGUILAR NAJERA	304780037
*	MASSIEL MORA RODRIGUEZ		604190071
* 	BRYHAN RODRIGUEZ MORA		115420325
*	JEAN CARLO VARGAS ZUÑIGA	402220474
*/

class Controller{
	
	constructor(v,m){
		this.model = m;
		this.vista = v;
	}
	
	guardar(mode,nc){
		return (mode)? this.guardarServer(nc) : this.guardarLocal(nc);
							// Server	 			// Local						
	}
  
	recuperar(mode,nick){
		return (mode)? this.recuperarServer(nick) : this.leerLocal(nick);
							// Server					// Local						
	}
	
  
	guardarServer(nick){  
		let m = this.model;
		let tmp = {N:m.N,E:m.entrada,S:m.salida,laberinto:m.laberinto,camino:m.camino};
		return fetch( this.model.serverDir + '/guardarJuego', this.postH(nick,JSON.stringify(tmp)))
		.then(r => r.text())
		.then(res => console.log("Juego guardado: " + res))
		.catch(err => console.log('Request failed', err));
	}
  
	cambioSonido(v){
	  
	  (v == 'MUTE')? this.vista.sound.value ='SOUND' : this.vista.sound.value = 'MUTE';
	  
	  return this.model.sound = !this.model.sound;
	}
	
	recuperarServer(nick){
		let mod = this.model;
		let viw = this.vista;
		return fetch(mod.serverDir + '/recuperarJuego?nick=' + nick, this.getH())
		.then(res => res.json())
		.then(json => JSON.parse(json))
		.then(obj => mod.update(obj))
		.then(lab => viw.drawLab1(lab))
		.then(_ => viw.pintarCamino())
		.catch(err => console.log('Request failed', err));
	}
  
	parsear(mat){
		let model = this.model;
		let obj = {N:model.N,E:model.entrada,S:model.salida,mat:model.laberinto};
		return JSON.stringify(obj);
	}
  
	leerLocal(nick){ // Agregar Nuevo Ver 

		let obj = JSON.parse(localStorage.getItem(nick));
  
		this.model.N = obj.pop();
		this.model.salida = obj.pop();
		this.model.entrada = obj.pop();
		this.model.laberinto = obj.pop();
		this.model.camino = obj.pop();
		this.vista.drawLab1(this.model.laberinto);
		this.vista.pintarCamino();
	}
  
	guardarLocal(nick){  // Agregar Nuevo Ver 
		let aux = new Array();
		aux.push(this.model.camino);
		aux.push(this.model.laberinto);
		aux.push(this.model.entrada);
		aux.push(this.model.salida);
		aux.push(this.model.N);
		localStorage.setItem(nick, JSON.stringify(aux));
	}
  
	getH(){
		return {  
				method: 'get', 
				mode:'no-cors',
				datatype:'html',
				headers: {  
					"Content-type": "text/html"  
				}  
			}
	}
  
	postH(nic,json){
		return {  
				method: 'post', 
				mode:'no-cors',
				datatype:'json',
				headers: {  
					"Content-type": "application/x-www-form-urlencoded"  
				},
				body:"nick=" + nic + "&data=" + json
			}
	}
  
	pedir(op){
		let dif = this.vista.dif;
		this.model.N = parseInt(dif[dif.selectedIndex].value);
		this.model.camino.splice(0,this.model.camino.length);
		
		let m = this.model;
		let v = this.vista;
		this.bloquear(v);
		let res = (op)? this.pedirServer(v,m) : this.pedirLocal(v,m);
		return res.then(_ => this.desbloquear(v));
	}

	bloquear(v){
			v.refresh.disabled = true;
			v.solve.disabled = true;
			v.save.disabled = true;
			v.get.disabled = true;
			v.dwnlI.disabled = true;
			v.reset.disabled = true;
			
	}
	
	desbloquear(v){
		v.refresh.disabled = false;
		v.solve.disabled = false;
		v.save.disabled = false;
		v.get.disabled = false;
		v.dwnlI.disabled = false;
		v.reset.disabled = false;
	}
	pedirLocal(v,m){
		return Promise.resolve(m.generarLaberinto())
		.then( _ => m.MakeLab())
		.then(_ => m.marcarES())
		.then( lab => v.drawLab1(lab))
		.then(_ => v.pintarCamino())
		.catch(err =>console.log('Error al crear Local ', err));
	}
	
	pedirServer(v,m){
		return fetch( m.serverDir + '/crearLab?dificultad=' + m.N, this.getH())
		.then(res => res.json())
		.then(json => JSON.parse(json))
		.then(obj => m.update(obj))
		.then(lab => v.drawLab1(lab))
		.then(_ => v.pintarCamino())
		.catch(err => console.log('Request failed: ', err));
	}
  
	iniciar_salir(nick, lg){
		return (nick != "" && lg == "Iniciar")?this.iniciar():this.salir();
	}
  
	iniciar(){
		this.vista.in_out.value = "Salir";
		this.vista.canvas.style.visibility='visible';
		this.pedir();
		this.vista.controles.style.visibility='visible';
		this.vista.nick.disabled = true; 
	}
   
	salir(lg){
		this.vista.in_out.value = "Iniciar";
		this.resetAll();
	}
   
	resetAll(){
		this.vista.canvas.style.visibility='hidden';
		this.vista.controles.style.visibility='hidden';
		this.vista.nick.value='';
		this.vista.nick.disabled=false;
		this.vista.dif[0].selected =true;
		this.vista.lineC.value='#000000';
		this.vista.backC.value='#A2E219';
		this.vista.modo[0].selected =true;
	}
   
   reset(){
	 this.model.camino = new Array();
	   this.vista.drawLab1(this.model.laberinto);	   
	   this.vista.pintarCamino();
   }
   
	pintaAutomatico(){
		let cam = new Array();
		this.model.solucion =  new Array();
		cam.push([0,this.model.entrada]);
		this.model.resolver(new Point(this.model.entrada,0),cam);
		this.vista.pintaAutomatico();
	}
 

	cambioColor(){ // Nuevo Agregar
		this.vista.drawLab1(this.model.laberinto);
		this.vista.pintarCamino();
	}
  
  
	descargarCanvas(link, canvas, filename){	
		link.href = canvas.toDataURL(); // obtenemos la imagen como png
		link.download = filename;
	}
}


//module.exports = Controller;