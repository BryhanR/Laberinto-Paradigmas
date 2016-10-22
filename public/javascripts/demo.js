
/*
* 			INTEGRANTES:
*
*	ALEXANDRA AGUILAR NAJERA	304780037
*	MASSIEL MORA RODRIGUEZ		604190071
* 	BRYHAN RODRIGUEZ MORA		115420325
*	JEAN CARLO VARGAS ZUÑIGA	402220474
*/

$(document).ready(function() {
	
	$('.button').click(function() {
		
		type = $(this).attr('data-type');
		
		$('.overlay-container').fadeIn(function() {
			
			window.setTimeout(function(){
				$('.window-container.'+type).addClass('window-container-visible');
			}, 100);
			
		});
	});
	
	$('.close').click(function() {
		$('.overlay-container').fadeOut().end().find('.window-container').removeClass('window-container-visible');
	});
	
});