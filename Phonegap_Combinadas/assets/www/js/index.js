var operacion = ""; //String que contiene la operaci�n

var longMax = parseInt("0"); //Cantidad de n�meros en la operaci�n
var longAct = parseInt("0"); //N�meros ya introducidos

var corchAb = false; //Si un corchete ha sido abierto y no cerrado
var corchIni = false; //Si un corchete se ha abierto al principio
var hayPar = false; //Si el corchete contiene un par�ntesis cerrado
var corchUtil = false; //Si el corchete contiene un par�ntesis cerrado y un signo

var parAb = false; //Si un par�ntesis ha sido abierto y no cerrado
var haySigno = false; //Si el par�ntesis contiene un signo

var contPar = false; //Si la operaci�n contiene un par�ntesis
var contCorch = false; //Si la operaci�n contiene un corchete
var contMult = false; //Si la operaci�n contiene una multiplicaci�n
var contDiv = false; //Si la operaci�n contiene una divisi�n

var caracUlt = parseInt("0"); //Cu�l ha sido el �ltimo caracter introducido
//1: [ , 2: ( , 3: n�mero , 4: signo , 5: ) , 6: ]





//EVENTOS AL INICIO

//Implementaci�n de fastclick
window.addEventListener('load', function() { 
	FastClick.attach(document.body); 
}, false);

$('#inicioPage').bind('pagebeforeshow', function(event) {
    reset();
});

$('#combinadasPage').bind('pageshow', function(event) {
	getOperacion();
});

// LISTENERS

$('#botConCorch').bind('vclick', function(event) { 
    longMax = $("#slider1").val();
    $.mobile.changePage($("#combinadasPage"));
});

$('#botSinCorch').bind('vclick', function(event) { 
    alert("Sin corchetes");
});

$('#botOperacion').bind('vclick', function(event) { 
	reset();
	getOperacion();
});

 
//FUNCIONES

function getOperacion(){
	primerCaracter();
	cuerpoOperacion();
	ultimoCaracter();
	
	//�ltima comprobaci�n para ver si la operaci�n aporta algo
	if (contCorch == false || contPar == false || contMult == false && contDiv == false){
	   reset();
	   getOperacion();
	   return;    
	}
	
	var operacionLimpia = operacion.split("*").join("x");	
	$("#boxOperacion").html(operacionLimpia);
	
	//Esto cambia los corchetes por par�ntesis para evitar errores al calcular el resultado
	operacionSC = operacion.split("]").join(")").split("[").join("(");
	
	var resultado = parseFloat(eval(operacionSC)).toFixed(2);
	if ( (resultado*100) % 100 == 0) { //Si el resultado es entero
		var resString = resultado.toString();
		resString = resString.split(".00").join(""); //Esto quita los decimales en caso de que el resultado sea entero
		$("#boxResultado").html(resString);
	} else {
		reset();
		getOperacion();	
	}
}

function primerCaracter() {
	var num = Math.random();
	if (num > 0 && num < 0.2){
		operacion += "[ ";
		caracUlt = 1;
		corchAb = true;
		corchIni = true;
		corchUtil = false;
		hayPar = false;
	} else if (num >= 0.2 && num < 0.4){
		operacion += "( ";
		caracUlt = 2;
		parAb = true;
		haySigno = false;
	} else {
		operacion += getNum();
		caracUlt = 3;
		longAct++;
	}
}


function cuerpoOperacion() {
	
	while(longAct < longMax) {
		
		if ( (longAct + 1) == longMax && corchUtil == false && parAb == true) {
			if (caracUlt == 2 || haySigno == false){
				reset();
				getOperacion();
				return;
			}
			operacion += ") ";
			caracUlt = 5;
			parAb = false;
			haySigno = false;
			contPar = true;
			if (corchAb == true){
				hayPar = true;
			}
		} else if (corchUtil == true && haySigno == false && parAb == true) {
		    reset();
            getOperacion();
            return;
		}
		
		switch(caracUlt) {
			case 1:
				var num = Math.random();
				if (num > 0 && num < 0.3 && (longMax - longAct) > 1){
					operacion += "( ";
					caracUlt = 2;
					parAb = true;
					haySigno = false;
				} else {
					operacion += getNum();
					caracUlt = 3;
					longAct++;
				}
				break;
				
			case 2:
				operacion += getNum();
				caracUlt = 3;
				longAct++;
				break;
				
			case 3:
				if (parAb == true && haySigno == true) {
					var num = Math.random();
					if (num > 0 && num < 0.2){
						operacion += ") ";
						caracUlt = 5;
						parAb = false;
						haySigno = false;
						contPar = true;
						if (corchAb == true){
							hayPar = true;
						}
					} else {
						operacion += getSigno();
						caracUlt = 4;
					}
				} else if (parAb == true && haySigno == false) {
					operacion += getSigno();
					caracUlt = 4;
					haySigno = true;
				} else if (corchAb == true && corchUtil == false) { //Mientras haya par�ntesis abierto no llega hasta aqu�, que es donde se cierran los corchetes
					operacion += getSigno();
					caracUlt = 4;
					haySigno = true;
					if (hayPar == true){
						corchUtil = true;
					}
				} else if (corchAb == true && corchUtil == true) {
					var num = Math.random();
					if (num > 0 && num < 0.5){
						operacion += "] ";
						caracUlt = 6;
						corchAb = false;
						corchUtil = false;
						contCorch = true;
					} else {
						operacion += getSigno();
						caracUlt = 4;
					}
				} else {
					operacion += getSigno();
					caracUlt = 4;
				}
				break;
				
			case 4:
				if (corchAb == true && parAb == true) {
					operacion += getNum();
					caracUlt = 3;
					longAct++;
				} else if (corchAb == true && parAb == false) {
					var num = Math.random();
					if (num > 0 && num < 0.3 && (longMax - longAct) > 1){
						operacion += "( ";
						caracUlt = 2;
						parAb = true;
						haySigno = false;
					} else {
						operacion += getNum();
						caracUlt = 3;
						longAct++;
					}
					if (corchUtil == false && hayPar == true) {
					    corchUtil = true;
					}
				} else if (parAb == false) { //As� no se abren par�ntesis ni corchetes dentro de par�ntesis
					var num = Math.random();
					if (num > 0 && num < 0.2 && (longMax - longAct) > 2){
						operacion += "[ ";
						caracUlt = 1;
						corchAb = true;
						corchUtil = false;
                        hayPar = false;
					} else if (num >= 0.2 && num < 0.4) {
						operacion += "( ";
						caracUlt = 2;
						parAb = true;
						haySigno = false;
					} else {
						operacion += getNum();
						caracUlt = 3;
						longAct++;
					}
				} else {
					operacion += getNum();
					caracUlt = 3;
					longAct++;
				}
				break;
			
			case 5:
				if (corchAb == true && corchUtil == true) {
					var num = Math.random();
					if (num > 0 && num < 0.5){
						operacion += "] ";
						caracUlt = 6;
						corchAb = false;
						corchUtil = false;
						contCorch = true;
					} else {
						operacion += getSigno();
						caracUlt = 4;
					}
				} else {
					operacion += getSigno();
					caracUlt = 4;
				}
				break;
			
			case 6:
				operacion += getSigno();
				caracUlt = 4;
				break;
			
		} //Cierre del switch
	} //Cierre del while
} //Cierre de cuerpoOperacion()

function ultimoCaracter(){
	if (parAb == true && corchAb == true){
		if (corchIni == true || hayPar == false) {
			reset();
			getOperacion();
			return;
		}		
		operacion += ") ]";
	} else if (corchAb == true){
		if (corchIni == true || hayPar == false || corchUtil == false) {
			reset();
			getOperacion();
			return;
		}
		operacion += "] ";
		corchAb = false;
		corchUtil = false;
		contCorch = true;
	} else if (parAb == true) {
		if (haySigno == false) {
			reset();
			getOperacion();
			return;
		}
		operacion += ") ";
		contPar = true;
	}
}


function getNum() {
	var numero = Math.ceil(Math.random()*9);
	return (numero + " ");
}


function getSigno(){
	var signo;
	var num = Math.random();
	if (num < 0.35){
		signo = "+ ";
	} else if (num >= 0.35 && num < 0.65) {
		signo = "- ";
	} else if (num >= 0.65 && num < 0.825){
		signo = "* ";
		contMult = true;
	} else {
		signo = "/ ";
		contDiv = true;
	}
	return signo;
}

function reset() {
	operacion = "";
	longAct = parseInt("0");
	corchAb = false;
	parAb = false;
	corchUtil = false;
	haySigno = false;
	hayPar = false;
	corchIni = false;
	contCorch = false;
	contPar = false;
	contMult = false;
	contDiv = false;
	$("#boxOperacion").html("");
	$("#boxResultado").html("");
}