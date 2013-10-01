var idioma = "EU"; //Idioma de la aplicación

var operacion = ""; //String que contiene la operación
var resString = ""; //String que contiene el resultado limpio

var longMax = parseInt("0"); //Cantidad de números en la operación
var longAct = parseInt("0"); //Números ya introducidos

var limMin = parseInt("0");
var limMax = parseInt("0");

var corchAb = false; //Si un corchete ha sido abierto y no cerrado
var corchIni = false; //Si un corchete se ha abierto al principio
var hayPar = false; //Si el corchete contiene un paréntesis cerrado
var corchUtil = false; //Si el corchete contiene un paréntesis cerrado y un signo

var parAb = false; //Si un paréntesis ha sido abierto y no cerrado
var parIni = false; //Si un paréntesis se ha abierto al principio
var haySigno = false; //Si el paréntesis contiene un signo

var contPar = false; //Si la operación contiene un paréntesis
var contCorch = false; //Si la operación contiene un corchete
var contMult = false; //Si la operación contiene una multiplicación
var contDiv = false; //Si la operación contiene una división

var caracUlt = parseInt("0"); //Cuál ha sido el último caracter introducido
//  1: [ , 2: ( , 3: número , 4: signo , 5: ) , 6: ]

var modoCD = false; //Modo de juego con divisiones
var modoCP = false; //Modo de juego con paréntesis
var modoCC = false; //Modo de juego con corchetes

var modoJuego = parseInt("0"); // Si es 1, se juegan los niveles seguidos; si es 2, solo un nivel

//VARIABLES PARA EL JUEGO
var nivelAct = parseInt("1");  //Nivel actual
var nivelSuperado = []; //Si un nivel determinado ha sido o no superado
var subnivelAct = parseInt("1"); //Subnivel actual (del 1 al 10)
var subnivelesTot = parseInt("0"); //Subniveles jugados en total (para las estadísticas)
var subnivelesTotNivel = []; //Subniveles totales jugados en este nivel (para las estadísticas)
var fallosAct = parseInt("0"); //Fallos cometidos en los subniveles de este nivel
var fallosTot = parseInt("0"); //Fallos cometidos en total (para las estadísticas)
var fallosTotNivel = []; //Fallos totales cometidos en este nivel (para las estadísticas)
var fallosSubnivel = []; //True o False para cada subnivel. Hace que no se cuente más de un fallo por subnivel
var falloModo2 = false; //Controla si hay error en el modo 2 para mostrar el botón a la siguiente cuenta
var porcentajeNivel = []; //De donde salen las estadísticas. Solo se guarda si es mayor que el valor previo

/////////////////////
//EVENTOS AL INICIO//
/////////////////////

//Implementación de fastclick
window.addEventListener('load', function() { 
	FastClick.attach(document.body); 
}, false);

$('#inicioPage').bind('pagebeforeshow', function(event) {

	loadVars();

    if ($.mobile.sdCurrentDialog != null) {
        $.mobile.sdCurrentDialog.close();
    }
    
    //Inicializa las variables para no dar valores nulos cuando deberían ser 0
	if (subnivelesTot == null) {
		subnivelesTot = parseInt("0");
	}
	if (fallosTot == null) {
		fallosTot = parseInt("0");
	}	
    
    if (idioma == null) {
    	idioma = "EU";
    }
    
    $('input[name="radio"]').filter('[value=' + idioma + ']').attr('checked', true).checkboxradio("refresh");;
    
    $('#botModo1').siblings('.ui-btn-inner').children('.ui-btn-text').text("Maila guztiak");
    $('#botModo2').siblings('.ui-btn-inner').children('.ui-btn-text').text("Maila bat bakarrik");
    $('#botEstadisticas').siblings('.ui-btn-inner').children('.ui-btn-text').text("Estatistikak");
    
    $('#tituloJolastu').html("JOLASTU");
    $('#tituloIdioma').html("HIZKUNTZA");
    
});

$('#listaPage').bind('pagebeforeshow', function(event) {

    if ($.mobile.sdCurrentDialog != null) {
        $.mobile.sdCurrentDialog.close();
    }

	if (modoJuego == 1) {
		$("#cab-dentro-lista").html("MODU ARRUNTA");
	} else {
		$("#cab-dentro-lista").html("MAILA BAT BAKARRIK");
	}

    var elListaNiveles = $('#listaNiveles');
    
    for ( var i = 1; i < 13; i++) {
    	
    	$("#li-izq-" + i).html( i + ". Maila");
    	
    	if (i < 5) {
    		$("#li-" + i).attr('tipo', "Biderketak");
    	} else if(i > 4 && i < 9) {
    		$("#li-" + i).attr('tipo', "Zatiketak");
    	} else {
    		$("#li-" + i).attr('tipo', "Parentesiak");
    	}
    	
    	if ( porcentajeNivel[i] != null && porcentajeNivel[i] != 0) {
	    	/*var porcentaje = parseFloat( (100 - (fallosTotNivel[i] * 100 / subnivelesTotNivel[i])) ).toFixed(2);
	    	if ( (porcentaje*100) % 100 == 0) { //Si el resultado es entero
				porcentaje = porcentaje.toString();
				porcentaje = porcentaje.split(".00").join("");
			}*/
			var porcentaje = parseFloat( porcentajeNivel[i] );
	    	$("#li-ctr-" + i).html( porcentaje + "%");
	    	if (porcentaje < 80) {
	    		$("#li-ctr-" + i).css("color", "red");
	    	} else if (porcentaje >= 80 && porcentaje < 100) {
	    		$("#li-ctr-" + i).css("color", "orange");
	    	} else {
	    		$("#li-ctr-" + i).css("color", "green");
	    	}
    	} else {
    		$("#li-ctr-" + i).html("");
    	}
    	
    	if (nivelSuperado[i] == true) {
    		$("#li-dch-" + i).html("<img src='img/check.png'>");
    		//$("#li-" + (i+1)).removeClass("disabled-li");
    	} else {
    		$("#li-dch-" + i).html("");
    		//$("#li-" + (i+1)).addClass("disabled-li");
    	}
    }
    
    elListaNiveles.children('li').bind('vclick', function(e) {
		e.preventDefault(); 
		e.stopImmediatePropagation(); 
		$('#listaNiveles').children('li').unbind('vclick');
		nivelAct = parseInt( $(this).attr('maila') );
		subnivelAct = parseInt("1");
        fallosAct = parseInt("0");
        $.mobile.changePage($("#combinadasPage"));		
	});
    
    elListaNiveles.listview({
        autodividers: true,
        autodividersTheme: "e",
        autodividersSelector: function (li) {
            var out = li.attr('tipo');
            return out;
        }
    }).listview('refresh');
});

$('#combinadasPage').bind('pagebeforeshow', function(event) {
	$('#inputPruebas').elastic();
	$("#botResultado").button('disable');
	$('#barraDchCombinadas').css("visibility", "hidden");
	
	$("#inputPruebas").attr("placeholder", "Egin hemen zure probak");
	$("#inputResultado").attr("placeholder", "Emaitza");
});

$('#combinadasPage').bind('pageshow', function(event) {
	mostrarNivel();
});

$('#estadisticasPage').bind('pagebeforeshow', function(event) {
	$("#cab-dentro-estadisticas").html("ESTATISTIKAK");
	
	$("#est-izq-1").html("Gainditutako mailak");
	$("#est-izq-2").html("Akatsik gabe gainditutako eragiketen portzentaila");
	$("#est-izq-3").html("Totalean gainditutako eragiketak");
	$("#est-izq-4").html("Totalezko akatsak");
	
	$('#botBorrarEst').siblings('.ui-btn-inner').children('.ui-btn-text').text("Ezabatu");
	
	//Estadística 1 (Niveles superados)
	var superados = parseInt("0");
	for (var i = 1; i < 13; i++) {
		if ( nivelSuperado[i] == true ) {
			superados++;
		}
	}
	$("#est-dch-1").html(superados + " / 12");
	
	//Estadística 2 (Porcentaje de niveles superados sin error)
	if ( subnivelesTot != null && subnivelesTot != 0) {
		var porcentaje = parseFloat( (100 - (fallosTot * 100 / subnivelesTot)) ).toFixed(2);
		if ( (porcentaje*100) % 100 == 0) { //Si el resultado es entero
			porcentaje = porcentaje.toString();
			porcentaje = porcentaje.split(".00").join("");
		}
		$("#est-dch-2").html( porcentaje + "%");
		if (porcentaje < 50) {
			$("#est-dch-2").css("color", "red");
		} else if (porcentaje >= 50 && porcentaje < 85) {
			$("#est-dch-2").css("color", "orange");
		} else {
			$("#est-dch-2").css("color", "green");
		}
	}
	
	//Estadística 3 (Operaciones resueltas en total)
	$("#est-dch-3").html(subnivelesTot);
	
	//Estadística 4 (Errores totales)
	$("#est-dch-4").html(fallosTot);
});


///////////////
// LISTENERS //
///////////////

$('#botModo1').bind('vclick', function(event) { 
    modoJuego = 1;
    $.mobile.changePage($("#listaPage"));
});

$('#botModo2').bind('vclick', function(event) {
    modoJuego = 2;
    $.mobile.changePage($("#listaPage"));
});

$('#botEstadisticas').bind('vclick', function(event) {
    $.mobile.changePage($("#estadisticasPage"));
});

$('#radioIdioma').bind('change', function(event) {
    idioma = $('input[name=radio]:checked').val();
    saveVars();
});

$('#botAtrasLista').bind('vclick', function(event) { 
	history.back();
});

$('#botAtrasCombinadas').bind('vclick', function(event) { 
	history.back();
});

$('#botAtrasEstadisticas').bind('vclick', function(event) { 
	history.back();
});

$('#botSigCombinadas').bind('vclick', function(event) { 
	if (subnivelAct == 5) {
		if (fallosAct < 2) {
			if (nivelAct == 12) {
				$("#combinadasPage").simpledialog2({ 
		        theme: 'b',
		        mode: 'blank',
		        animate: false,
		        blankContent : "<div style='padding:15px;'>" +              
		            "<h2 style='text-align:center;'>" + 
		            "<span style='color:purple'>ZORIONAK!<br />Azken maila gainditu duzu!</span>" + 
		            "</h2>" + 
		            "<a rel='close' onclick='atras()' data-role='button' href='#'>Onartu</a>" +
		            "</div>"
			    });		
				nivelSuperado[nivelAct] = true;
				subnivelesTot++;
				subnivelesTotNivel[nivelAct]++;
				fallosAct = 0;
				subnivelAct = 1;
				fallosSubnivel = [];
				saveVars();
			} else {
				alerta("<span style='color:green'>" + nivelAct + ". Maila<br />gainditu duzu!</span>");
				var porcent = (5 - fallosAct) * 20;
				if (porcent > porcentajeNivel[nivelAct] || porcentajeNivel[nivelAct] == null) { 
					porcentajeNivel[nivelAct] = parseFloat(porcent);
				}
				proxSubnivel();
			}
		} else { //Aquí se ha fallado más de lo permitido. No se va a proxSubnivel(), sino que las variables se resetean y se sale a la lista
			var porcent = (5 - fallosAct) * 20;
			if (porcent > porcentajeNivel[nivelAct]) { 
				porcentajeNivel[nivelAct] = parseFloat(porcent);
			}
			//alerta("<span style='color:red'>Zoritzarrez, " + fallosAct + " akats egin dituzu,<br />eta behin bakarrik huts egin dezakezu.</span>");
			$("#combinadasPage").simpledialog2({ 
		        theme: 'b',
		        mode: 'blank',
		        animate: false,
		        blankContent : "<div style='padding:15px;'>" +              
		            "<h2 style='text-align:center;'>" + 
		            "<span style='color:red'>Zoritzarrez, " + fallosAct + " akats egin dituzu,<br />eta behin bakarrik huts egin dezakezu.</span>" + 
		            "</h2>" + 
		            "<a rel='close' onclick='atras()' data-role='button' href='#'>Onartu</a>" +
		            "</div>"
		    });
			subnivelesTot++;
			subnivelesTotNivel[nivelAct]++;
			fallosAct = 0;
			subnivelAct = 1;
			fallosSubnivel = [];
			saveVars();
		}			
	} else {
		proxSubnivel();
	}
});

$('#divResultado').bind('vclick', function(event) { 
	var resObj = $('#boxResultado');
	if ( resObj.css("visibility") == "hidden" ) {
		resObj.css("visibility", "visible");
	} else {
		resObj.css("visibility", "hidden");
	}
});

/*$('#botNueva').bind('vclick', function(event) { 
	reset();
	getOperacion();
});*/

$("#inputResultado").bind("keyup", function(event) { 
	if ($("#inputResultado").val() != "") {
		$("#botResultado").button('enable');
	} else {
		$("#botResultado").button('disable');
	}
});

$('#botResultado').bind('vclick', function(event) { 
	if ($("#inputResultado").val() == resString) {
		if (subnivelAct == 5) {
			if (fallosAct < 2) {
				if (nivelAct == 12) {
					$("#combinadasPage").simpledialog2({ 
			        theme: 'b',
			        mode: 'blank',
			        animate: false,
			        blankContent : "<div style='padding:15px;'>" +              
			            "<h2 style='text-align:center;'>" + 
			            "Emaitza zuzena!<br /><br /><span style='color:purple'>ZORIONAK!<br />Azken maila gainditu duzu!</span>" + 
			            "</h2>" + 
			            "<a rel='close' onclick='atras()' data-role='button' href='#'>Onartu</a>" +
			            "</div>"
				    });		
					nivelSuperado[nivelAct] = true;
					subnivelesTot++;
					subnivelesTotNivel[nivelAct]++;
					fallosAct = 0;
					subnivelAct = 1;
					fallosSubnivel = [];
					saveVars();
				} else {
					alerta("Emaitza zuzena!<br /><br /><span style='color:green'>" + nivelAct + ". Maila<br />gainditu duzu!</span>");
					var porcent = (5 - fallosAct) * 20;
					if (porcent > porcentajeNivel[nivelAct] || porcentajeNivel[nivelAct] == null) { 
						porcentajeNivel[nivelAct] = parseFloat(porcent);
					}
					proxSubnivel();
				}
			} else { //Aquí se ha fallado más de lo permitido. No se va a proxSubnivel(), sino que las variables se resetean y se sale a la lista
				var porcent = (5 - fallosAct) * 20;
				if (porcent > porcentajeNivel[nivelAct]) { 
					porcentajeNivel[nivelAct] = parseFloat(porcent);
				}
				//alerta("Emaitza zuzena!<br /><br /><span style='color:red'>Zoritzarrez, " + fallosAct + " akats egin dituzu,<br />eta behin bakarrik huts egin dezakezu.</span>");
				$("#combinadasPage").simpledialog2({ 
			        theme: 'b',
			        mode: 'blank',
			        animate: false,
			        blankContent : "<div style='padding:15px;'>" +              
			            "<h2 style='text-align:center;'>" + 
			            "Emaitza zuzena!<br /><br /><span style='color:red'>Zoritzarrez, " + fallosAct + " akats egin dituzu,<br />eta behin bakarrik huts egin dezakezu.</span>" + 
			            "</h2>" + 
			            "<a rel='close' onclick='atras()' data-role='button' href='#'>Onartu</a>" +
			            "</div>"
			    });
				subnivelesTot++;
				subnivelesTotNivel[nivelAct]++;
				fallosAct = 0;
				subnivelAct = 1;
				fallosSubnivel = [];
				saveVars();
				//$.mobile.changePage($("#listaPage"));
			}			
		} else {
			alerta("Emaitza zuzena!");
			proxSubnivel();
		}
	} else {
		if (fallosSubnivel[subnivelAct] != true || falloModo2 != true) {
			fallosSubnivel[subnivelAct] = true;
			falloModo2 = true;
			fallosAct++;
			fallosTot++;
			fallosTotNivel[nivelAct]++;
			actualizarMarcador();
			saveVars();
			$('#barraDchCombinadas').css("visibility", "visible");
		}
		alerta("<span style='color:red'>Emaitza ez da zuzena, <br />saiatu berriro.<span>");
	}
});

$('#botBorrarEst').bind('vclick', function(event) { 
	$('<div>').simpledialog2({
	    mode: 'button',
	    animate: false,
	    buttonPrompt: "Ziur zaude estatistika guztiak ezabatu nahi dituzula? <br />Aurrerapen guztiak galduko dituzu.",
	    buttons : {
	        'Bai': {
		        click: function () { 
		            nivelSuperado = [];
					subnivelesTot = parseInt("0");
					subnivelesTotNivel = [];
					fallosTot = parseInt("0");
					fallosTotNivel = [];
					porcentajeNivel = [];
					$("#est-dch-2").html(""); //Deja en blanco la segunda estadística, que por algún motivo no pierde su valor.
					saveVars();
					atras();
		        }
	        },
	        'Ez': {
		        click: function () { 
		            $('#buttonoutput').text('Cancel');
		        },
		    icon: "delete",
	        theme: "c"
	        }
	    }
	});
});

/////////////////////
//GESTIÓN DEL JUEGO//
/////////////////////

function mostrarNivel(){
	reset();
	//Inicializa los arrays para no dar valores nulos cuando deberían ser 0
	if (fallosTotNivel[nivelAct] == null) {
		fallosTotNivel[nivelAct] = parseInt("0");
	}
	if (subnivelesTotNivel[nivelAct] == null) {
		subnivelesTotNivel[nivelAct] = parseInt("0");
	}
	if (porcentajeNivel[nivelAct] == null) {
		porcentajeNivel[nivelAct] = parseInt("0");	
	}	
	if (fallosSubnivel[subnivelAct] == null) {
		fallosSubnivel[subnivelAct] = false;
	}
	cargarVariables();
	getOperacion();
	actualizarMarcador();
}

function cargarVariables(){
	switch(nivelAct) {
		case 1: 
			longMax = 3;
			modoCD = false;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 30;
			break;
			
		case 2: 
			longMax = 4;
			modoCD = false;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 40;
			break;
		
		case 3: 
			longMax = 5;
			modoCD = false;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 50;
			break;
			
		case 4: 
			longMax = 6;
			modoCD = false;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 50;
			break;
			
		case 5: 
			longMax = 3;
			modoCD = true;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 30;
			break;
			
		case 6: 
			longMax = 4;
			modoCD = true;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 40;
			break;
			
		case 7: 
			longMax = 5;
			modoCD = true;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 50;
			break;
			
		case 8: 
			longMax = 6;
			modoCD = true;
			modoCP = false;
			modoCC = false;
			limMin = 0;
			limMax = 50;
			break;
			
		case 9: 
			longMax = 3;
			modoCD = false;
			modoCP = true;
			modoCC = false;
			limMin = -30;
			limMax = 30;
			break;
			
		case 10: 
			longMax = 4;
			modoCD = false;
			modoCP = true;
			modoCC = false;
			limMin = -30;
			limMax = 40;
			break;
			
		case 11: 
			longMax = 5;
			modoCD = false;
			modoCP = true;
			modoCC = false;
			limMin = -30;
			limMax = 50;
			break;
			
		case 12: 
			longMax = 6;
			modoCD = false;
			modoCP = true;
			modoCC = false;
			limMin = -30;
			limMax = 50;
			break;
	}
}

function actualizarMarcador(){
	if (modoJuego == 1) {
		$("#cab-izq").html("Maila: " + nivelAct + " - " + subnivelAct);
	} else {
		$("#cab-izq").html("Maila: " + nivelAct + " - n");
	}
	if (fallosAct == 0) {
		$("#cab-dch").html("Akatsak: " + fallosAct);
	} else if (fallosAct == 1) {
		$("#cab-dch").html("Akatsak: <span style='color:orange'>" + fallosAct + "</span>");
	} else {
		$("#cab-dch").html("Akatsak: <span style='color:red'>" + fallosAct + "</span>");
	}
}

function proxSubnivel(){
	if (modoJuego == 1) {
		if (subnivelAct < 5) {
			subnivelesTot++;
			subnivelesTotNivel[nivelAct]++;
			subnivelAct++;
			saveVars();
		} else {
			nivelSuperado[nivelAct] = true;
			subnivelesTot++;
			subnivelesTotNivel[nivelAct]++;
			nivelAct++;
			fallosAct = 0;
			subnivelAct = 1;
			fallosSubnivel = [];
			saveVars();
		}
	} else {
		subnivelesTot++;
		subnivelesTotNivel[nivelAct]++;
		saveVars();
	}
	mostrarNivel();
}

function alerta(mensaje) {
    $("#combinadasPage").simpledialog2({ 
        theme: 'b',
        mode: 'blank',
        animate: false,
        blankContent : "<div style='padding:15px;'>" +              
            "<h2 style='text-align:center;'>" + mensaje + "</h2>" + 
            "<a rel='close' onclick='butDisable()' data-role='button' href='#'>Onartu</a>" +
            "</div>"
    });
}

function atras() {
	history.back();
}

//Esta función es llamada por el botón de las alertas, así el botón de enviar resultado se desactiva al cerrar el diálogo y no automáticamente (por motivo desconocido)

function butDisable() {
	$("#botResultado").button('disable');
}

function saveVars() {
	localStorage.setItem("subnivelesTot", subnivelesTot);
	localStorage.setItem("fallosTot", fallosTot);
	localStorage.setItem("idioma", idioma);
	localStorage["nivelSuperado"] = JSON.stringify(nivelSuperado);
	localStorage["subnivelesTotNivel"] = JSON.stringify(subnivelesTotNivel);
	localStorage["fallosTotNivel"] = JSON.stringify(fallosTotNivel);
	localStorage["porcentajeNivel"] = JSON.stringify(porcentajeNivel);
}

function loadVars() {
	subnivelesTot = localStorage.getItem("subnivelesTot");
	fallosTot = localStorage.getItem("fallosTot");
	idioma = localStorage.getItem("idioma");
	if (localStorage["nivelSuperado"] != null) {
		nivelSuperado = JSON.parse(localStorage["nivelSuperado"]);
	}
	if (localStorage["subnivelesTotNivel"] != null) {
		subnivelesTotNivel = JSON.parse(localStorage["subnivelesTotNivel"]);
	}
	if (localStorage["fallosTotNivel"] != null) {
		fallosTotNivel = JSON.parse(localStorage["fallosTotNivel"]);
	}
	if (localStorage["porcentajeNivel"] != null) {
		porcentajeNivel = JSON.parse(localStorage["porcentajeNivel"]);
	}
}

//////////////////////////////////////
//ALGORITMO PARA OBTENER OPERACIONES//
//////////////////////////////////////

function getOperacion(){
	if (modoCC == true && modoCP == true) { //Modo corchetes y paréntesis
		
		primerCaracter();
		cuerpoOperacion();
		ultimoCaracter();
		
		//Última comprobación para ver si la operación aporta algo
		if (contCorch == false || contPar == false || contMult == false && contDiv == false){
			reset();
			getOperacion();
			return;    
		} else if (modoCD == true && contDiv == false) {
			reset();
			getOperacion();
			return;
		}
	} else if (modoCP == true) { //Modo paréntesis sin corchetes
		
		primerCaracterSC();
		cuerpoOperacionSC();
		ultimoCaracterSC();
		
		//Última comprobación para ver si la operación aporta algo
		if (contPar == false || contMult == false && contDiv == false){
			reset();
			getOperacion();
			return;    
		} else if (modoCD == true && contDiv == false) {
			reset();
			getOperacion();
			return;
		}
	} else { //Modo sin corchetes ni paréntesis
		
		primerCaracterSP();
		cuerpoOperacionSP();
		
		if (contMult == false && contDiv == false){
			reset();
			getOperacion();
			return;    
		} else if (modoCD == true && contDiv == false) {
			reset();
			getOperacion();
			return;
		}
	}
	
	//Esto es común para todos los modos
	var operacionLimpia = operacion.split("*").join("x");	
	$("#boxOperacion").html(operacionLimpia);
	
	//Esto cambia los corchetes por paréntesis para evitar errores al calcular el resultado
	operacionSC = operacion.split("]").join(")").split("[").join("(");
	
	var resultado = parseFloat(eval(operacionSC)).toFixed(2);
	if (resultado < limMin || resultado > limMax) { //Comprueba que el resultado esté dentro de los límites del nivel
		reset();
		getOperacion();
	} else if ( (resultado*100) % 100 == 0) { //Si el resultado es entero
		resString = resultado.toString();
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

function primerCaracterSC() {
	var num = Math.random();
	if (num < 0.3){
		operacion += "( ";
		caracUlt = 2;
		parAb = true;
		parIni = true;
		haySigno = false;
	} else {
		operacion += getNum();
		caracUlt = 3;
		longAct++;
	}
}

function primerCaracterSP() {
	operacion += getNum();
	caracUlt = 3;
	longAct++;
}


function cuerpoOperacion() {
	
	while(longAct < longMax) {
		
		//Si hay un corchete abierto con un paréntesis abierto, fuerza su cierre en el 
		//penúltimo caracter para que el corchete pueda cerrarse siendo útil
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
			case 1: //  [
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
				
			case 2: //  (
				operacion += getNum();
				caracUlt = 3;
				longAct++;
				break;
				
			case 3: //  número
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
				} else if (corchAb == true && corchUtil == false) { //Mientras haya paréntesis abierto no llega hasta aquí, que es donde se cierran los corchetes
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
				
			case 4: //  signo
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
				} else if (parAb == false) { //Así no se abren paréntesis ni corchetes dentro de paréntesis
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
			
			case 5: //  )
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
			
			case 6: //  ]
				operacion += getSigno();
				caracUlt = 4;
				break;
			
		} //Cierre del switch
	} //Cierre del while
} //Cierre de cuerpoOperacion()

function cuerpoOperacionSC() {
	
	while(longAct < longMax) {
		
		switch(caracUlt) {
				
			case 2: // (
				operacion += getNum();
				caracUlt = 3;
				longAct++;
				break;
				
			case 3: //  número
				if (parAb == true && haySigno == true) {
					var num = Math.random();
					if (num > 0 && num < 0.3){
						operacion += ") ";
						caracUlt = 5;
						parAb = false;
						haySigno = false;
						contPar = true;
					} else {
						operacion += getSigno();
						caracUlt = 4;
					}
				} else if (parAb == true && haySigno == false) {
					operacion += getSigno();
					caracUlt = 4;
					haySigno = true;
				} else {
					operacion += getSigno();
					caracUlt = 4;
				}
				break;
				
			case 4: //  signo
				if (parAb == false) { //Así no se abren paréntesis dentro de paréntesis
					var num = Math.random();
					if (num < 0.3) {
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
			
			case 5: //  )
				operacion += getSigno();
				caracUlt = 4;
				break;
			
		} //Cierre del switch
	} //Cierre del while
} //Cierre de cuerpoOperacionSC()

function cuerpoOperacionSP() {
	
	while(longAct < longMax) {
		
		switch(caracUlt) {
							
			case 3: //  número
				operacion += getSigno();
				caracUlt = 4;
				break;
				
			case 4: //  signo
				operacion += getNum();
				caracUlt = 3;
				longAct++;
				break;
						
		} //Cierre del switch
	} //Cierre del while
} //Cierre de cuerpoOperacionSP()


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

function ultimoCaracterSC(){
	if (parAb == true) {
		if (parIni == true) {
			reset();
			getOperacion();
			return;
		} else if (haySigno == false) {
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
	if (modoCD == true) {
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
	} else {
		if (num < 0.35){
			signo = "+ ";
		} else if (num >= 0.35 && num < 0.65) {
			signo = "- ";
		} else {
			signo = "* ";
			contMult = true;
		}
		return signo;
	}
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
	parIni = false;
	contCorch = false;
	contPar = false;
	contMult = false;
	contDiv = false;
	$("#boxOperacion").html("");
	$("#boxResultado").html("");
	$("#inputPruebas").val("");
	$('#inputPruebas').css("height", "2em");
	$("#inputResultado").val("");
	$('#barraDchCombinadas').css("visibility", "hidden");
	falloModo2 = false;
}