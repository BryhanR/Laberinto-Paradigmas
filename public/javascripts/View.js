
/*
* 			INTEGRANTES:
*
*	ALEXANDRA AGUILAR NAJERA	304780037
*	MASSIEL MORA RODRIGUEZ		604190071
* 	BRYHAN RODRIGUEZ MORA		115420325
*	JEAN CARLO VARGAS ZUÑIGA	402220474
*/

class View{	

	constructor(){
		console.log("View Creada..");
		this.posXC = 0;	// Nuevo
		this.posYC = 0;	// Nuevo
		document.addEventListener('keydown',e => this.processKey(e));
		
		this.model = new Model();
		this.control = new Controller(this,this.model);
		
		
		this.controles = document.getElementById('controles');
		this.canvas = document.getElementById('canvas');

		this.nick = document.getElementById('nick');
		this.in_out = document.getElementById('login_logout');

		this.modo = document.getElementById('ModoJuego');
			
		this.dif = document.getElementById('opcionDificultad');

		this.refresh = document.getElementById('Refresh');
							
		this.lineC = document.getElementById('colorLinea');
						
		this.backC = document.getElementById('colorFondo');				
		this.solve = document.getElementById('solve');
				
		this.dwnl = document.getElementById('download');
		this.dwnlI = document.getElementById('descargarIMG');

		this.save = document.getElementById('save');
		this.get = document.getElementById('get');
		
		this.sound = document.getElementById('sound');
		this.reset = document.getElementById('reset');
		
		this.setListeners(); 
		
	}
	
	drawLine(x1,y1,x2,y2){
		let ctx = this.canvas.getContext("2d");
		ctx.strokeStyle = this.lineC.value;
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}
	
	drawCircle(color1, color2){
		let ctx = this.canvas.getContext('2d');
		ctx.beginPath();
		ctx.fillStyle = color1;
		ctx.strokeStyle= color2;
		ctx.arc(this.posXC+5, this.posYC+8, 5, 0, 2 * Math.PI, false); // Revisar
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}

	setListeners(){
		this.in_out.addEventListener('click',e => this.control.iniciar_salir(this.nick.value,this.in_out.value));
		this.refresh.addEventListener('click', e => this.control.pedir(parseInt(this.modo[this.modo.selectedIndex].value)));
		this.solve.addEventListener('click', e => this.control.pintaAutomatico());
		this.save.addEventListener('click', e => this.control.guardar(parseInt(this.modo[this.modo.selectedIndex].value),this.nick.value));
		this.get.addEventListener('click', e => this.control.recuperar(parseInt(this.modo[this.modo.selectedIndex].value),this.nick.value));
		this.dwnlI.addEventListener('click', e => this.control.descargarCanvas(this.dwnl,this.canvas,'Laberinto.png'));
		this.lineC.addEventListener("input", e => this.control.cambioColor());
		this.backC.addEventListener("input", e => this.control.cambioColor());		
		this.sound.addEventListener('click', e => this.control.cambioSonido(this.sound.value));
		this.reset.addEventListener('click', e => this.control.reset());
	}
	
	ajustar(N){
		let max = 20*25+95;
		if((N*25+28)>max){  
			this.canvas.width = max+10;
			this.canvas.height = max+28;
			this.model.pix = max/N;
		}else{
			this.model.pix = 25;
			this.canvas.width = N*this.model.pix+10;
			this.canvas.height = N*this.model.pix+28;

		}
	}
	
	resetCanvas(){
		let ctx = this.canvas.getContext('2d');
		ctx.fillStyle = this.backC.value;
		ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	}
	
	drawLab1(mat){
		let N = this.model.N;		
		this.ajustar(N);
		this.resetXY();
		let pix = this.model.pix;
		this.resetCanvas();
		mat.forEach( (e,i) => {
							e.forEach( (e1,j) => {
											if(e1.a == 1)
												this.drawLine(j*pix+5,i*pix+8,j*pix+pix+5,i*pix+8); // dibuja la linea Horizontal de arriba
											if(e1.i == 1)
												this.drawLine(j*pix+5,i*pix+8,j*pix+5,i*pix+pix+8); // dibuja la linea Vertical de la izquierda		
										}
									);
							if(mat[i][N-1].d == 1)
								this.drawLine(N*pix+5,i*pix+8,N*pix+5,i*pix+pix+8); // dibuja la linea Vertical de la derecha
						}
					);
		mat[N-1].forEach( (e,i) => {
								if(e.ab == 1) 	
									this.drawLine(i*pix+5,N*pix+8,i*pix+pix+5,N*pix+8); // dibuja la linea Horizontal de abajo
								}
						);
		return true;		
	}
	
	pintarCamino(){
		this.model.camino.forEach( (e,i) => 
									{
										this.posXC = e.x;
										this.posYC = e.y;
										(i != this.model.camino.length-1)? this.drawCircle("yellow","red")
																		: this.drawCircle("red","yellow")
									}
								)
		return this.model.laberinto;
	}
	
	resetXY(){
		this.posXC = (this.model.pix*this.model.entrada)+(this.model.pix/2);
		this.posYC = (this.model.pix/2);
		this.model.camino.unshift(new Point(this.posXC,this.posYC));
	}
  
	no_pared(x,y,op){	// Verifica que no exista pared
		switch(op){
			case 37: // left
				return this.model.laberinto[x][y].i == 0;
			case 38: // up
				return this.model.laberinto[x][y].a == 0 && x>0;
			case 39: // right
				return this.model.laberinto[x][y].d == 0;
			case 40: // down
				return this.model.laberinto[x][y].ab == 0 && x < this.model.N;
		}
		return false;
	}
	
	pintaAutomatico(){
	//solucion.push(new Point(entrada[1],entrada[0]));
		this.resetXY();	
		this.model.solucion.forEach((act,i,vec) =>{
								var cod = 0;
								if(i>0 && vec[i-1][0] > act[0]) // arriba
									cod = 38;
								else if(i>0 && vec[i-1][0] < act[0]) // abajo
									cod = 40;
								else if(i>0 && vec[i-1][1] < act[1]) // derecha
									cod = 39;
								else if(i>0 && vec[i-1][1] > act[1]) // izquierda
									cod = 37;
								var evt = document.createEvent("KeyboardEvent");
								evt.initKeyEvent("keydown",       // typeArg,                                                           
								true,             // canBubbleArg,                                                        
								true,             // cancelableArg,                                                       
								null,             // viewArg,  Specifies UIEvent.view. This value may be null.     
								false,            // ctrlKeyArg,                                                               
								false,            // altKeyArg,                                                        
								false,            // shiftKeyArg,                                                      
								false,            // metaKeyArg,                                                       
								cod,               // keyCodeArg,                                                      
								0);              // charCodeArg);
								document.dispatchEvent(evt);
								//console.log(i);
							});
							this.ultimoPaso(); // Nuevo
	
	}
	
	
	
	processKey(e) {
		// If the face is moving, stop it.
		let dx = 0;
		let dy = 0;
		let rnd = this.model.rnd;
		// If an arrow key was pressed, and adjust the speed accordingly.
		// (Ignore any other key.)
		// The up arrow was pressed, so move up.
		if (e.keyCode == 38) {
			dx = -1;
		}
		// The down arrow was pressed, so move down.
		if (e.keyCode == 40) {
			dx = 1;
		}
		// The left arrow was pressed, so move left.
		if (e.keyCode == 37) {
			dy = -1;
		}
		// The right arrow was pressed, so move right.
		if (e.keyCode == 39) {
			dy = 1;
		}
		//console.log(this.model.laberinto);
		if( (dx!=0 || dy !=0) && Math.floor((this.posYC/this.model.pix)<this.model.N)){
			let pix = this.model.pix;
			let ob = this.no_pared(Math.floor((this.posYC/pix)),Math.floor((this.posXC/pix)),e.keyCode);
			if(ob){
				this.drawCircle("yellow","red");
				dx = dx + Math.floor((this.posYC/pix));
				this.posYC = (pix*dx)+((pix/2));
				dy = dy + Math.floor((this.posXC/pix));
				this.posXC = (pix*dy)+((pix/2)); //Pos y del Circulo
				this.model.camino.push(new Point(this.posXC,this.posYC));
				this.drawCircle("red","yellow");
				(Math.floor((this.posYC/pix))==this.model.N)?this.ganador():0; // Nuevo
				let s =  document.getElementById("audioCamino");
				s.pause();
				s.currentTime = 0;
				(this.model.sound) ? s.play():false;
			}else{
				let s = document.getElementById("audioPared");
				s.pause();
				s.currentTime = 0;
				(this.model.sound) ? s.play():false;
			}
		} 
	}
  
 ganador() {	// Nuevo	
		$('.overlay-container').fadeIn(function() {
			
			window.setTimeout(function(){
				$('.window-container.zoomin').addClass('window-container-visible');
			}, 100);		
		});

		
}
ultimoPaso(){ // Nuevo
		this.drawCircle("yellow","red");
		var dx = 1 + Math.floor((this.posYC/this.model.pix));
		this.posYC = (this.model.pix*dx)+((this.model.pix/2));
		this.model.camino.push(new Point(this.posXC,this.posYC));
		this.drawCircle("red","yellow");
		this.ganador();
	}
}