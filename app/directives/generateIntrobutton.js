var app = angular.module('Vigets')
app.directive("addIntroButton", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
				angular.element(document.getElementById('spaceforIntroBtn')).append($compile("<div><button ng-click='startTour();' style='display:none' on-load-clicker>startIntro</button></div>")(scope));
		});
	};
});