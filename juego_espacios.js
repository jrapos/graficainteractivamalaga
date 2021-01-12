/*************************************/
/* Declaración de variables globales */
/*************************************/

var libreriaPalabras = new Array("Huelva", "Sevilla", "Alcalá la Real","Cádiz", "Setenil de las Bodegas", "Málaga", "Córdoba", "Jaen", "Granada", "Almería", "Almonaster la Real","Dos Hermanas","Antequera","Ronda","Rincón de la Victoria","Villanueva del Trabuco","Santa Olalla Del Cala","Sanlucar de Barrameda", "La Línea de la Concepción","Alhaurín de la Torre","Alhaurín el Grande","San Juan de Aznalfarache","Valencina de la Concepción","Morón de la Frontera","Estepa","Aroche","Santiponce","Medina Sidonia","Villanueva de Córdoba","Hinojosa del Duque","Fuente la Lancha","Capileira","Cogollos de Guadix","Alboloduy","Las tres villas","Pampaneira","Bérchules","Roquetas de Mar","Cuevas del Almanzora");
var palabra;
var palabraAplanada;
var letrasJugadas = [];
var pasosJuego = 9;
var pasos = 0;
var aciertos = 0;
var espacios = 0;


/*****************************************************************/
/* EVENTO: Detecta cuando la página se ha terminado de cargar    */
/* y comienza a realizar acciones iniciales como asignación      */
/* de las funciones que se ejecutarán con cada evento.           */
/*****************************************************************/
window.onload = function () {
    var btn1 = document.getElementById("btnPlay");
    btn1.onclick = iniciaJuego;
    // document.onkeypress = detectaPulsacionTecla;
    asignarEventoLetra();
    deshabilitarBotones(true);
}

/***********************************************************************************/
/* FUNCIÓN: función que se ejecuta al pulsar botón de play                         */
/* además de inicializar los campos de la interfaz, genera una nueva palabra       */
/***********************************************************************************/
var iniciaJuego = function () {
   //var visorLetras = document.getElementById("displayLetrasUsadas");
    var visorMensajes = document.getElementById("displayMensajes");
    var visorEstado = document.getElementById("displayEstadoJuego");
    var visorPalabra = document.getElementById("displayPalabra");
    var barraEstado = document.getElementById("displayBarraEstado");
    var barraCompletado = document.getElementById("displayBarraCompletado");
   // visorLetras.innerHTML = "";
    visorMensajes.innerHTML = "";
    visorMensajes.style.display = "none";

    for (var i = 1; i <= pasos; i++) {
        visorEstado.classList.remove("ahorcado" + pasos);
    }
    visorEstado.classList.add("ahorcado0");
    visorPalabra.innerHTML = "";
    barraEstado.style.width = "0";
    barraCompletado.style.width = "0";  
    obtienePalabra();
    deshabilitarBotones(false);
    aciertos=0;
    pasos=0;
}


/***********************************************************************v***************/
/* FUNCIÓN: Se asigna la función que manejará el evento de click a cada botón de letra */
/***************************************************************************************/
var asignarEventoLetra = function () {

    var letras = document.getElementsByClassName("letras");
    var n = letras.length;
    for (var i = 0; i < n; i++) {
        letras[i].onclick = detectaBotonPulsado;

    }
}

/***********************************************************************v***************/
/* FUNCIÓN: Función que habilita o deshabilita los botones                             */
/***************************************************************************************/
var deshabilitarBotones = function (estado) {

    var letras = document.getElementsByClassName("letras");
    var boton;
    var n = letras.length;
    for (var i = 0; i < n; i++) {
        boton = document.getElementById(letras[i].id);
        boton.disabled = estado;

    }
}

/*************************************************************************v****v*****************/
/* FUNCIÓN: Se detecta el botón de letra que ha sido pulsado y se procede a jugar con esa letra */
/*************************************************************************v**********************/
var detectaBotonPulsado = function (elEvento) {
    var letra = this.id.toLowerCase();
    juega(letra);
    this.disabled = true;
}

/*************************************************************************v****v***************/
/* FUNCIÓN: Se detecta la tecla que ha sido pulsada del teclado y se procede a jugar con ella */
/*************************************************************************v********************/
var detectaPulsacionTecla = function () {
    var evento = window.event;
    var tecla = String.fromCharCode(evento.charCode);

    console.log(tecla);
    if (letrasJugadas.indexOf(tecla) != -1) {
        console.log("Ya jugó con esa letra");
    } else {
        letrasJugadas.push(tecla);
    }
    juega(tecla);
}

/*************************************************************************v****v***********************/
/* FUNCIÓN: Una vez marcada una letra por cualquiera de las dos opciones se juega con ella            */
/* Lo primero es llamar a una función que compruebe si se ha acertado o no                            */
/* en función de lo que ocurra iremos haciendo las actualizaciones oportunas en la interfaz del juego */
/*************************************************************************v****************************/
var juega = function (letra) {
  
    var visorEstado = document.getElementById("displayEstadoJuego");
    var visorPalabra = document.getElementById("displayPalabra");
    var barraEstado = document.getElementById("displayBarraEstado");
    var barraCompletado = document.getElementById("displayBarraCompletado");
    var palabraEnJuego = new String(visorPalabra.innerHTML);
    var letrasCadena = palabraEnJuego.split(" ");
    var esFinJuego = false;
    var ganador = false;
    palabraEnJuego = "";

    var apariciones = compruebaAcierto(letra);
    //visorLetras.innerHTML += letra;

    if (apariciones.length != 0) {

        for (var i = 0; i < palabraAplanada.length; i++) {
            if (palabraAplanada[i] == letra) {
                palabraEnJuego += letra + " ";
            } else {
                palabraEnJuego += letrasCadena[i] + " ";
            }
        }
        visorPalabra.innerHTML = palabraEnJuego;

        barraCompletado.style.borderRadius = "50px";
        barraCompletado.style.width = String((aciertos * 100)/(palabraAplanada.length-espacios)) + "%";

        if (seCompletoPalabra()) {
            ganador = true;
            esFinJuego = true;
        }

    } else { 
        
        visorEstado.classList.remove("ahorcado" + pasos);   
        pasos++;     
        visorEstado.classList.add("ahorcado" + pasos);
        barraEstado.style.borderRadius = "50px";
        barraEstado.style.width = String((pasos + 1) * 10) + "%";
        if (pasos == pasosJuego) {
            ganador = false;
            esFinJuego = true;
        }
    }

    if (esFinJuego)
        finJuego(ganador);
}


/*************************************************************************v****v***********************/
/* FUNCIÓN: Función que realiza las acciones finales una vez finalizada la partida                    */
/*************************************************************************v****************************/
var finJuego = function (gana) {
    var visorMensajes = document.getElementById("displayMensajes");
    visorMensajes.style.display = "block";

    if (gana) {
        visorMensajes.innerHTML = "Ganaste";

    } else {
        visorMensajes.innerHTML = "Perdiste, la palabra era "+palabra;
    }
    deshabilitarBotones(true);
}

/***************************************************v****v*******************/
/* FUNCIÓN: Obtiene la palabra del array para jugar de forma aleatoria      */
/* Además se aplana (en minúsculas y sin acento) para hacer comparaciones   */
/* y se presenta en pantalla el número de letras que tiene la palabra       */
/* como un símbolo de _ o cualquier otra opción que se elija                */
/****************************************************************************/
var obtienePalabra = function () {
    var visorPalabra = document.getElementById("displayPalabra");
    var indice = Math.round(Math.random() * (libreriaPalabras.length - 1));
    palabra = libreriaPalabras[indice];
    palabraAplanada = aplanaPalabra(palabra);
    console.log(palabra);
    console.log(palabraAplanada);
    for (var i = 0; i < palabraAplanada.length; i++) {
        var arr = palabraAplanada.split("");
        
        if(arr[i]!=" ")
            visorPalabra.innerHTML += "_ ";
        else
            visorPalabra.innerHTML += "&nbsp; ";
    }
    
    espacios = palabraAplanada.split(" ").length-1;
    console.log("espacios",espacios)
}

/***************************************************v****v*******************/
/* FUNCIÓN: Aplana la cadena que recibe como parámetro o argumento          */
/* de entrada y la devuelve ya procesada a través de la instrucción return  */
/****************************************************************************/
var aplanaPalabra = function (palabra) {

    palabra = palabra.toLowerCase();
    palabra = palabra.replace("á", "a");
    palabra = palabra.replace("é", "e");
    palabra = palabra.replace("í", "i");
    palabra = palabra.replace("ó", "o");
    palabra = palabra.replace("ú", "u");
    return palabra;
}

/***************************************************v****v*************************/
/* FUNCIÓN: Comprueba si una letra jugada está en la palabra elegida              */
/* En caso positivo, registra la aparición o apariciones de la posición           */
/* de esa letra en la palabra y la devuelve a través de una instrucción return    */
/**********************************************************************************/
var compruebaAcierto = function (letra) {

    var posicion = palabraAplanada.indexOf(letra);
    var apariciones = [];
    while (posicion != -1) {
        apariciones.push(posicion);       
        posicion = palabraAplanada.indexOf(letra, posicion + 1);
        aciertos++;
    }

    return apariciones;
}

/***************************************************v****v*************************/
/* FUNCIÓN: Comprueba si el número de aciertos coincide con las letras            */
/* de la palabra, en caso afirmativo ya se habría terminado el juego              */
/**********************************************************************************/
var seCompletoPalabra = function () {

    var resultado = false;
   
    if (aciertos == (palabraAplanada.length-espacios))
        resultado = true;
    return resultado;
}
