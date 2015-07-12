(function(){
	angular.module('Vigets')
	.controller('initController',initController)
	initController.$inject = [
		'$rootScope',
		'$state',
		'$webSql'
	]

	function initController(
		$rootScope,
		$state,
		$webSql
	){
		var vm = this;

		vm.userMail;
		vm.userPass;
		vm.users = []

		vm.login = function(){
			//$rootScope.isLogin = true;
			var success = false;
				if(vm.userPass != undefined && vm.userPass != ""
					&& vm.userMail != undefined && vm.userMail != ""){

					//obtener todos los usuarios
					$rootScope.db.selectAll("usuarios").then(function(results) {
					  for(var i=0; i < results.rows.length; i++){
					    vm.users.push(results.rows.item(i));
					  }

						for(var i = 0; i < vm.users.length; i++){
					    	if(vm.users[i].email == vm.userMail && vm.users[i].password == vm.userPass){
					    		success = true;
					    		console.log(vm.users[i].name)
					    	}else{
					    		success = false;
					    		console.log('error')
					    	}
					    }

					    if(success){
					    	//console.log('here we are')
					    	vm.userMail = "";
							vm.userPass = "";
					    	$rootScope.isLogin = true;
					    	$state.go('app.dashboard')
					    }else{
					    	$rootScope.isLogin = false;
					    	console.log('Oops!')
					    }

					})
				

				}else{
					alert('Por favor escribe tu usuario y contraseña')
				}
			//$state.go('app.dashboard')
		}

		vm.logout = function(){
			$rootScope.isLogin = false;
			$state.go('app.home')
		}
	}
})();