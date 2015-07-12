(function(){
	angular.module('Vigets')
	.controller('initController',initController)
	initController.$inject = [
		'$rootScope',
		'$state'
	]

	function initController(
		$rootScope,
		$state
	){
		var vm = this;

		vm.login = function(){
			$rootScope.isLogin = true;
			$state.go('app.dashboard')
		}
	}
})();