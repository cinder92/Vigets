(function(){
	'use strict'
	angular.module('Vigets').
	controller('installCtrl',installCtrl)
	installCtrl.$inject = ['SweetAlert','$rootScope','$state']

	function installCtrl(SweetAlert,$rootScope,$state){
		var vm = this

		vm.credentials = {
			userName : '',
			userMail : '',
			userPass : ''
		}

		vm.createAccount = function(){
			var success = false;
				if(vm.credentials.userPass != undefined && vm.credentials.userPass != ""
					&& vm.credentials.userMail != undefined && vm.credentials.userMail != ""
					&& vm.credentials.userName != undefined && vm.credentials.userName != ""){

					var userData = {
						name : vm.credentials.userName,
						email : vm.credentials.userMail,
						password : vm.credentials.userPass
					}

					//obtener todos los usuarios
					$rootScope.db.insert("usuarios",userData).then(function(results) {
					  	
							$rootScope.current_user_id = results.insertId
					    	//vm.startIntroAtlogin = true
					    	localStorage.setItem('have_users',"true")
					    	$state.go('app.home')
					    	
					})
				

				}else{
					SweetAlert.swal({
						 title : "Oops!",
						 text: 'Por favor escribe tu nombre / usuario / contraseña',
						 type: "warning"
					})
					//alert('Por favor escribe tu usuario y contraseña')
				}
			//$state.go('app.dashboard')
		}

		
	}
})()