


function getFormatedDate(date,format){
	try {
		if(isSetValue(date)&&isSetValue(format))
			return dateFormat(date,format,true);
		return null;
	} catch (e) {
		throw "Herramientas_getFormatedDate: "+e;
	}	
};

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue /* + "; " + expires*/;
}

function hasText(texto){
	return (typeof texto !== 'undefined' && texto !=null && texto !="");
}

/*
 * para las opciones de insertar un elemento a un array de elementos. Evita mostrar los elementos ya existentes
 * en el json array
 * */


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function deleteCookie(name) {
	  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function borraCookiesSesion(){
	deleteCookie(global_cookieNivelName);
	deleteCookie(global_cookieTokenName);
}

function isAuthenticated(){
	if(getCookie(global_cookieNivelName)!= "" && getCookie(global_cookieTokenName)!=""){
    	return true;
    }
    return false;
}


function cierraSesion(){
	borraCookiesSesion();
	location.pathname("/");
}

function isEmpty(texto){
	if(texto == "" || typeof texto ==='undefined'){
		return true;
	}
	else{
		return false;
	}
}

function vacioIfUndefined(variable){
	return (typeof variable ==='undefined')? "":variable;
}

function prepararParamURL(objeto, urlService ){
	urlPreparada= serverURL+"/"+urlService+"?";
	var arreglo = fromObjectToArray(objeto);
	for(i = 0; i<arreglo.length ;i++){
		if(i>0){
			urlPreparada = urlPreparada + "&";
		}
		urlPreparada = urlPreparada + arreglo[i].key + "=" + arreglo[i].value;
	}
	return urlPreparada;
}

function prepararParamPOST(objeto, urlService ){
	
	urlPreparada= serverURL+"/"+urlService+"?";
	var arreglo = fromObjectToArray(objeto);
	var elementos = {};
	for(i = 0; i<arreglo.length;i++){
		elementos[arreglo[i].key] = arreglo[i].value;
	}
	return elementos;
}

function ObjectValue(key,value){
	this.key=key;
	this.value=value;	
}

function fromObjectToArray(element){	
	var arr = null;
	if(element!=null){
		arr = Object.keys(element).map(function (key) {
			if(element[key] != "" && element[key]!=null){
				return (typeof element[key] === 'object')? new ObjectValue(key,element[key].key)
														:new ObjectValue(key,element[key]);
			}
			else{
				return new ObjectValue(key,"");
			}	
		});
	}
	return arr;
}

function getStringHost(){
	//alert("url: " + window.location.protocol +"//" + window.location.host + window.location.pathname);
	return window.location.protocol +"//" + window.location.host + window.location.pathname;
}

function validaIsNumberMayorIgualACero(numero){	
	return (!isNaN(numero) && numero>=0);
}


/** recibe un valor, si es un número lo devuelve, si no, retorna 0 **/
getNumberOrReturnZero=function(value){return isNaN(value)?0:value;}

/*recibe un atributo y el valor por defecto que se asignará. Si el atributo está indefinido, asignará el valor recibido. 
 * */
setDefault = function(atributo, valorPorDefecto){
	if(typeof atributo ==='undefined' || !atributo){
		atributo = valorPorDefecto;
	}
	return atributo;
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    return (!(charCode > 31 && (charCode < 48 || charCode > 57)) || (charCode>34&&charCode<41) || charCode==46 || charCode == 45);
}
function isIntegerPositiveNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    return (!(charCode > 31 && (charCode < 48 || charCode > 57)) || (charCode>34&&charCode<41));
}
function isIntegerPositiveNumberOrCommaKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    return (!(charCode > 31 && (charCode < 48 || charCode > 57)) || (charCode>34&&charCode<41) || charCode==44 || charCode==46);
}

function isSetValue(value){
	return (typeof value!=='undefined'&&value!=null);
}

function numFormatoDecimal(value, decimalPlaces){
	if(!isNaN(decimalPlaces)){return parseFloat(value).toFixed(decimalPlaces)}
	return parseFloat(value).toFixed(2);
}

function parseFloatWithComma(value, decimalPlaces){
	return parseFloat(value.text().replace(',','.')).toFixed(decimalPlaces);
}

function getElementProperty(elementID,property){
	
	return document.getElementById(elementID).style.width;
}


function waitFor(test, expectedValue, msec, count, source, callback, array1,array2) {
	//test: función que se ejecutará con el parámetro "array" cada 'msec' microsegundos para comprobar que su resultado sea igual o no a "expectedValue"
	//array2 se utiliza en caso de que la función callback utilice parámetros distintos a los de array1. en caso de la función callback solamente requiera
	//		de los parámetros de array2, deberá crearse la función callback que reciba un objeto no existente en el primer campo, ej: x = function(nada, params){alert(params);}
    // Check if condition met. If not, re-check later (msec).
	///////////////////////////////////////////////////////////////////////////////////////
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//TEST NO PUEDE IR SIN PARÁMETROS SI ES ES UN ARRAY
	//console.log("test: " + test + " callback: " + callback);
	//console.log("array: " + angular.toJson(array1,"pretty"));
	//console.log("expectedValue !== test: " + (test(array1) !== expectedValue));
	
	while (test(array1) !== expectedValue) {
        count++;
        setTimeout(function() {
            waitFor(test, expectedValue, msec, count, source, callback, array1, array2);
        }, msec);
        return;
    }
    // Condition finally met. callback() can be executed.
    //console.log(source + ': ' + test() + ', expected: ' + expectedValue + ', ' + count + ' loops.');
    //cuando el array está definido, es porque la función requiere parámetros. De otra forma, se ejecuta una función sin parámetros 
    
    if(test(array1)==expectedValue){
    	callback(array1,array2);
    }    
}


getUserLayoutRoute = function(userRoll){
	switch (userRoll){
	case roles.administrador:{return  '/adminLayout'; break;}//administrador 
	case roles.disegno:{return '/disegnoLayout'; break;}//diseño
	case roles.disegnoAdmin:{return '/disegnoLayout'; break;}//diseño
	case roles.bodegaAdmin:{return '/bodegaLayout'; break;}//admin bodega
	case roles.bodega:{	return '/bodegaLayout'; break;}//bodega
	case roles.fabricacion:{return '/fabricaConsulta'; break;}//fábrica
	case roles.operacionesAdmin:{return '/operacionesLayout';break;}//operaciones
	case roles.operaciones:{return '/operacionesLayout';break;}//operaciones
	case roles.despachoAdmin:{$location.path('/despachoLayout');break;}
	case roles.despacho:{$location.path('/despachoLayout');break;}
	case roles.cedi:{$location.path('/cediLayout');break;}
	case roles.cediAdmin:{$location.path('/cediLayout');break;}
	case roles.salaVentas:{ return '/salaVentas';break;}
	case roles.salaVentasAdmin:{ return '/salaVentas';break;}
	default: {return "/";}
	}
}


getUserLayout = function(){
	return getUserLayoutRoute(parseInt(getCookie(global_cookieNivelName)));
}




var cargarArchivo=function($http,$scope,ErrorReportService, serviceURL){
	
	var myHeaders = new Object;
	myHeaders[global_restfulTokenName] = getCookie(global_cookieTokenName);
	myHeaders['Content-type']= 'application/json';
	myHeaders['Accept'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
	var req = {
			 method: 'GET',
			 url: serviceURL,
			 headers: myHeaders,
			 responseType:'arraybuffer'
		};
	$http(req).success(function(data, status, headers, config){
		cabecera = headers();
		var blob = new Blob([data], {type: cabecera['content-type']});
		var objectUrl = URL.createObjectURL(blob);
		window.open(objectUrl);
	}).error(function(data, status, headers, config) {		
		ErrorReportService.report(headers, status);        
    })	
};

var cargarArchivoConParametros=function($http,$scope,ErrorReportService, serviceURL, params){
	var myHeaders = new Object;
	myHeaders[global_restfulTokenName] = getCookie(global_cookieTokenName);
	myHeaders['Content-type']= 'application/json';
	myHeaders['Accept'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
	var req = {
			 method: 'PUT',
			 url: serviceURL,
			 headers: myHeaders,
			 data: params,
			 responseType:'arraybuffer'
		};
	$http(req).success(function(data, status, headers, config){
		cabecera = headers();
		var blob = new Blob([data], {type: cabecera['content-type']});
		var objectUrl = URL.createObjectURL(blob);
		window.open(objectUrl);
	}).error(function(data, status, headers, config) {		
		ErrorReportService.report(headers, status);        
    })	
};

/*en "otherParams" tiene que venir el objeto "funcion" que será la función encargada de "recoger" el "data" y aplicarlo al scope deseado.*/
var loadCatalogos=function($http, $scope, ErrorReportService, serviceURL, otherParams){
	var serviceURL = serverURL + "/" + serviceURL;
	var myHeaders = new Object;
	myHeaders[global_restfulTokenName] = getCookie(global_cookieTokenName);
	var req = {
			 method: 'GET',
			 url: serviceURL,
			 headers: myHeaders
		};
	$http(req).success(function(data){
		otherParams.funcion(data);
	}).error(function(data, status, headers, config) {
		ErrorReportService.report(headers, status);        
    });
};


//Unidades de medida que se utilizan para los artículos de compra.
var unidades={unidad:"Und.",
		metrosLineales:"m.lineales",
		metrosCuadrados:"m2",
		kilogramos:"Kg",
		litros:"l"
		};

