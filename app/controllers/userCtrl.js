(function(){
	'use strict';
	angular.module('Vigets')
	.controller('usuariosCtrl',usuariosCtrl)
	usuariosCtrl.$inject = [
		'$rootScope',
		'$state',
		'$webSql',
		'SweetAlert'
	]

	function usuariosCtrl(
		$rootScope,
		$state,
		$webSql,
		SweetAlert
	){
		var vm = this;

		vm.userName;
		vm.userEmail;
		vm.userPass;
		vm.userID;
		vm.pageSize = 5;
		vm.currentPage = 0;

		vm.getAllUsers = function(){
			vm.users = [];
			$rootScope.db.selectAll("usuarios").then(function(results) {
			  for(var i=0; i < results.rows.length; i++){
			    vm.users.push(results.rows.item(i));
			  }
			})
		}

		vm.numberOfPages = function(){
	        return Math.ceil(vm.users.length/vm.pageSize);                
	    }

	    vm.userDetails = function(index){
	    		
	    		if(index != undefined && index > 0){
				    for(var i = 0; i < vm.users.length; i++){
				    	if(vm.users[i].id == index){
				    		//vm.prodCat = vm.categorias[i].category
						    vm.userName = vm.users[i].name;
						    vm.userEmail  = vm.users[i].email;
							vm.userPass = vm.users[i].password;
						    vm.userID = vm.users[i].id
				    	}
				    }
				    //vm.getAllProds()
				}
	    }

		vm.saveUser = function(){
			if(vm.userName != undefined && vm.userName != ""
				&& vm.userEmail != undefined && vm.userEmail != ""
				&& vm.userPass != undefined && vm.userPass != ""){

				var newUser = {
					name : vm.userName,
					email : vm.userEmail,
					password : vm.userPass
				}

				//validar que se actualice el producto
				if(vm.userID != null && vm.userID != undefined && vm.userID > 0 && vm.userID != ""){
					//update
					//newProd.id = vm.prodID;
					$rootScope.db.update("usuarios", newUser, {
					  'id': vm.userID 
					})
				}else{
					//create
					$rootScope.db.insert('usuarios', newUser).then(function(results) {
					  //console.log(results.insertId);
					  //vm.productos.push(newProd);
					})
				}

				vm.userName = "";
				vm.userEmail = "";
				vm.userPass = "";
				vm.userID = "";

			    vm.getAllUsers()

			}else{
				SweetAlert.swal({
					 title : "Oops!",
					 text: 'Por favor escriba el nombre / email / password',
					 type: "warning"
				})
				//alert('Por favor escriba el nombre, email y password del usuario')
			}
		}

		vm.delUser = function(index){
			//console.log(index)
			
			if(index != undefined && index > 0 && index != "" && index != null){
				
				SweetAlert.swal({
				   title: "Aviso",
				   text: "¿Deseas eliminar este usuario?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Si, borrar!",
				   cancelButtonText: "Cancelar",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
					   	vm.userName = "";
						vm.userEmail = "";
						vm.userPass = "";
						vm.userID = "";
						$rootScope.db.del("usuarios", {"id": index})
					 	vm.getAllUsers()
				      SweetAlert.swal("¡Borrado!", "El usuario ha sido eliminado", "success");
				   } else {
				      SweetAlert.swal("Cancelado", "El usuario no ha sido eliminado", "error");
				   }
				});

			}
		}

		 vm.getAllUsers()
	}
})()