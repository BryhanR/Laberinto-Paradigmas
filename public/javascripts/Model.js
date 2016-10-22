
/*
* 			INTEGRANTES:
*
*	ALEXANDRA AGUILAR NAJERA	304780037
*	MASSIEL MORA RODRIGUEZ		604190071
* 	BRYHAN RODRIGUEZ MORA		115420325
*	JEAN CARLO VARGAS ZUÑIGA	402220474
*/

class Model{

	constructor(){
		this.N = 10;
		this.serverDir = 'http://127.0.0.1:1337';
		this.entrada;
		this.salida;
		this.laberinto; 
		this.solucion = new Array();
		this.pix = 25;
		this.sound = true;
		this.camino = new Array(); // almacena el camino seguido por el jugador
	}
	
	generarLaberinto(){
		this.laberinto = Array.from({length:this.N},(_,e) => Array.from({length:this.N}, (_,k) => {return {d:1,i:1,a:1,ab:1,v:0};}));
		return this.laberinto;
	}
  
	rnd(n){
		return Math.floor(Math.random()*n);
	}
  
	marcarES(){
		this.entrada = this.rnd(this.N);
		this.salida = this.rnd(this.N);
		this.laberinto[0][this.entrada].a = 0; // entrada
		this.laberinto[this.N-1][this.salida].ab = 0; // salida
		return this.laberinto;
	}
  
	moverDerecha(fil,col,mat,recursivo){
		mat[fil][col].d = 0;
		mat[fil][col+1].i = 0;
		return recursivo(mat,fil,col+1);  
	}
	
	moverIzquierda(fil,col,mat,recursivo){
		mat[fil][col].i = 0;
		mat[fil][col-1].d = 0;
		return recursivo(mat,fil,col-1);
	}
  
	moverArriba(fil,col,mat,recursivo){
		mat[fil][col].a = 0;
		mat[fil-1][col].ab = 0;
		return recursivo(mat,fil-1,col);
	}
  
	moverAbajo(fil,col,mat,recursivo){
		mat[fil][col].ab = 0;
		mat[fil+1][col].a = 0;
		return recursivo(mat,fil+1,col);
	}
  
	MakeLab(mat){
		let n = this.N;
		let rnd = this.rnd;
		let moverArriba = this.moverArriba;
		let moverAbajo = this.moverAbajo;
		let moverIzquierda = this.moverIzquierda;
		let moverDerecha = this.moverDerecha;
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
						(col < n-1 && mat[fil][col+1].v == 0)? moverDerecha(fil,col,mat,recursivo) : true;
						break;
					case 2: //izquierda
						(col > 0 && mat[fil][col-1].v == 0) ? moverIzquierda(fil,col,mat,recursivo) : true;
						break;
					case 3:   //abajo
						(fil < n-1 && mat[fil+1][col].v == 0)? moverAbajo(fil,col,mat,recursivo) : true;
						break;
				}
				pos.splice(opc,1); // elimina el valor seleccionado del array		
			}
			return mat;
		}
		return recursivo(this.laberinto,rnd(this.N),rnd(this.N));
	}
  
	update(obj){	  
		this.N = obj.N;
		this.entrada = parseInt(obj.E);
		console.log("Entrada: " + obj.E);
		this.salida = obj.S;		
		this.laberinto = obj.laberinto;
		this.camino = obj.camino;
		return this.laberinto;
	}
 
  //---------------------------------------------------------Backtracking -------------------------------------------------
	esSolucion(p){
		return p.y == this.N-1 && this.laberinto[p.y][p.x].ab == 0;
	}
    
	obtenerHijos(p){
		let N = this.N;
		let matriz = this.laberinto;
        let hijos = new Array();
        ( p.x < N-1 && matriz[p.y][p.x].d == 0 && matriz[p.y][p.x+1].i == 0 && matriz[p.y][p.x+1].v == 1)? // derecha
            hijos.push({x:p.x+1,y:p.y}) : 0;
        ( p.y > 0 && matriz[p.y][p.x].a == 0 && matriz[p.y-1][p.x].ab == 0 && matriz[p.y-1][p.x].v == 1)? // arriba
            hijos.push({x:p.x,y:p.y-1}) : 0;
        ( p.y < N-1 && matriz[p.y][p.x].ab == 0 && matriz[p.y+1][p.x].a == 0 && matriz[p.y+1][p.x].v == 1)? // abajo
            hijos.push({x:p.x,y:p.y+1}) : 0;        
        ( p.x > 0 && matriz[p.y][p.x].i == 0 && matriz[p.y][p.x-1].d == 0 && matriz[p.y][p.x-1].v == 1)? // izquierda
            hijos.push({x:p.x-1,y:p.y}) : 0;
        return hijos;
    }
	 
	resolver(p,camino){	   
	   return (this.esSolucion(p))?p: 
									(
										(this.solucion.length != 0)? null:
										(
											this.laberinto[p.y][p.x].v = 0,
											this.obtenerHijos(p).forEach( e =>
											{
												let c = camino.concat([[e.y,e.x]]);
												let p2 = this.resolver(e,c);
												if(p2 != null)
													this.solucion = c;   
											}),
											this.laberinto[p.y][p.x].v = 1,
											null
										)
									); 
    }

}


//module.exports = Model;