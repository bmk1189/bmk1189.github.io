/**
 * 
 */

var jquery_multipleColumnsDropDownList=function(){
		$(document).ready(function(){
			
			var spacesToAdd = 5;
			var biggestLength = 0;
			
			$("#selectSoportesTwoColumns option").each(function(){				
				var len=$(this).text().length;
			    if(len > biggestLength){
			        biggestLength = len;
			    }			    
			});
			var padLength = biggestLength + spacesToAdd;
			$("#selectSoportesTwoColumns option").each(function(){
			    var parts = $(this).text().split('_');
			    var strLength = parts[0].length;
			    for(var x=0; x<(padLength-strLength); x++){
			        parts[0] = parts[0]+' '; 
			    }
			    $(this).text(parts[0].replace(/ /g, '\u00a0')+'+'+parts[1]).text;
			});			
		});		
	};
	
var scrollTable=function(tableId){
	$(document).ready(function () {	
		
		var tableSelector='#'+tableId;
		alert($(tableSelector).html());
		$(tableSelector).fxdHdrCol({				
			fixedCols: -1,
			width: "100%",
			height: "100%",
			colModal: [
			{ width: 49, align: 'center' },/*numero*/
			{ width: 49, align: 'center' },/*isAdicional*/
			{ width: 63, align: 'center'},/*solicitante*/
			{ width: 77, align: 'left' },/*justificacion*/					
			{ width: 57, align: 'left'},/*operador*/
			{ width: 62, align: 'left'},/*f creacion*/
			{ width: 66, align: 'left'},/*f confirmacion*/
			{ width: 67, align: 'left'},/*f fabricacion*/
			{ width: 67, align: 'left'},/*f entrega*/
			{ width: 67, align: 'left'},/*f despacho*/
			{ width: 49, align: 'center'},/*urgente*/					
			{ width: 100, align: 'center'}/*eliminar*/					
			],
			sort: true
		});				
	});
};
	
	