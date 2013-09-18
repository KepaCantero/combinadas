var operacion = "";
var longMax = 15;
var longAct = parseInt("0");
var corchAb = false;
var parAb = false;
var corchUtil = false;
var caracUlt = parseInt("0");
var haySigno = false;
var hayPar = false;


//EVENTOS AL INICIO

//Implementación de fastclick
window.addEventListener('load', function() { 
	FastClick.attach(document.body); 
}, false);

$('#combinadasPage').bind('pageshow', function(event) {
	getOperacion();
});


// LISTENERS

$('#botOperacion').bind('vclick', function(event) { 
	reset();
	getOperacion();
});

 
//FUNCIONES

function getOperacion(){
	primerCaracter();
	cuerpoOperacion();
	ultimoCaracter();
	//var operacionLimpia = operacion.replace("*", "x");
	
	var operacionLimpia = operacion.split("*").join("x");
	
	try {
		$("#boxOperacion").html(operacionLimpia);
	} catch(e){
		alert("Excepción");
		reset();
		getOperacion();
	}
	
	if (parseFloat(eval(operacion)) !== "NaN") {
		var resultado = parseFloat(eval(operacion)).toFixed(2);
		var resString = resultado.toString();
		resString = resString.split(".00").join(""); //Esto quita los decimales en caso de que el resultado sea entero
		$("#boxResultado").html(resString);
	} else {
		alert("El resultado es NaN");
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
	} else if (num >= 0.2 && num < 0.4){
		operacion += "( ";
		caracUlt = 2;
		parAb = true;
	} else {
		operacion += getNum();
		caracUlt = 3;
		longAct++;
	}
}


function cuerpoOperacion() {
	
	while(longAct < longMax) {
		
		if ( (longAct + 1) == longMax && corchUtil == false && parAb == true) {
			operacion += ") ";
			caracUlt = 5;
			parAb = false;
			if (corchAb == true){
				hayPar = true;
				corchUtil = true;
			}
		}
		
		switch(caracUlt) {
			case 1:
				var num = Math.random();
				if (num > 0 && num < 0.3 && (longMax - longAct) > 1){
					operacion += "( ";
					caracUlt = 2;
					parAb = true;
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
				} else if (corchAb == true && corchUtil == false) { //Mientras haya paréntesis abierto no llega hasta aquí, que es donde se cierran los corchetes
					operacion += getSigno();
					caracUlt = 4;
					haySigno = true;
					if (hayPar == true){
						corchUtil = true;
						hayPar = false;
					}
				} else if (corchAb == true && corchUtil == true) {
					var num = Math.random();
					if (num > 0 && num < 0.5){
						operacion += "] ";
						caracUlt = 6;
						corchAb = false;
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
					} else {
						operacion += getNum();
						caracUlt = 3;
						longAct++;
					}
				} else if (parAb == false) { //Así no se abren paréntesis ni corchetes dentro de paréntesis
					var num = Math.random();
					if (num > 0 && num < 0.2 && (longMax - longAct) > 2){
						operacion += "[ ";
						caracUlt = 1;
						corchAb = true;
					} else if (num >= 0.2 && num < 0.4) {
						operacion += "(";
						caracUlt = 2;
						parAb = true;
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
		operacion += ") ]";
	} else if (corchAb == true){
		operacion += "]";
	} else if (parAb == true) {
		operacion += ")";
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
	} else {
		signo = "/ ";
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
}