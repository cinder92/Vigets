(function(){
	'use strict';
	angular.module('Vigets')
	.controller('clientesCtrl',clientesCtrl)
	clientesCtrl.$inject = [
		'$rootScope',
		'$state',
		'$webSql',
		'SweetAlert'
	]

	function clientesCtrl(
		$rootScope,
		$state,
		$webSql,
		SweetAlert
	){
		var vm = this;

		vm.cteName;
		vm.cteAge;
		vm.cteEmail;
		vm.ctePhone;
		vm.cteFacebook;
		vm.cteTwitter;
		vm.cteDir;
		vm.catID;
		vm.pageSize = 5;
		vm.currentPage = 0;

		function refreshFields(){
			vm.cteName = "";
			vm.cteAge = "";
			vm.cteEmail = "";
			vm.ctePhone = "";
			vm.cteFacebook = "";
			vm.cteTwitter = "";
			vm.cteID = "";
			vm.cteDir = ""

		    vm.getAllCtes()
		}

		vm.getAllCtes = function(){
			vm.ctes = [];
			$rootScope.db.selectAll("clientes").then(function(results) {
			  for(var i=0; i < results.rows.length; i++){
			    vm.ctes.push(results.rows.item(i));
			  }
			})
		}

		vm.numberOfPages = function(){
	        return Math.ceil(vm.ctes.length/vm.pageSize);                
	    }

	    vm.cteDetails = function(index){
	    		
	    		if(index != undefined && index > 0){
				    for(var i = 0; i < vm.ctes.length; i++){
				    	if(vm.ctes[i].id == index){
				    		//vm.prodCat = vm.categorias[i].category
						    vm.cteName = vm.ctes[i].name;
						    vm.cteAge = (undefined == vm.ctes[i].age) ? '' : vm.ctes[i].age;
							vm.cteEmail = (undefined == vm.ctes[i].email) ? '' : vm.ctes[i].email;
							vm.ctePhone = vm.ctes[i].phone;
							vm.cteFacebook = (undefined == vm.ctes[i].facebook) ? '' : vm.ctes[i].facebook;
							vm.cteTwitter = (undefined == vm.ctes[i].twitter) ? '' : vm.ctes[i].twitter;
						    vm.cteDir = vm.ctes[i].direccion;
						    vm.cteID = vm.ctes[i].id
				    	}
				    }
				    //vm.getAllProds()
				}
	    }

		vm.saveCte = function(){
			if(vm.cteName != undefined && vm.cteName != ""
				&& vm.ctePhone != undefined && vm.ctePhone != ""
				&& vm.cteDir != undefined && vm.cteDir != ""){

				var newCte = {
					name : vm.cteName,
					age : vm.cteAge,
					email : vm.cteEmail,
					phone : vm.ctePhone,
					facebook : vm.cteFacebook,
					twitter : vm.cteTwitter,
					direccion : vm.cteDir
				}

				//validar que se actualice el producto
				if(vm.cteID != null && vm.cteID != undefined && vm.cteID > 0 && vm.cteID != ""){
					//update
					//newProd.id = vm.prodID;
					$rootScope.db.update("clientes", newCte, {
					  'id': vm.cteID 
					})
				}else{
					//create
					$rootScope.db.insert('clientes', newCte).then(function(results) {
					  //console.log(results.insertId);
					  //vm.productos.push(newProd);
					})
				}

				//refresh fields
				refreshFields()

			}else{
				SweetAlert.swal({
					 title : "Oops!",
					 text: 'Por favor escriba el nombre / teléfono / dirección',
					 type: "warning"
				})
				//alert('Por favor escriba el nombre y el telefono del cliente')
			}
		}

		vm.delCte = function(index){
			//console.log(index)
			
			if(index != undefined && index > 0 && index != "" && index != null){

				SweetAlert.swal({
				   title: "Aviso",
				   text: "¿Deseas eliminar este cliente?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Si, borrar!",
				   cancelButtonText: "Cancelar",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
					   	$rootScope.db.del("clientes", {"id": index})
						//refresh fields
						refreshFields()
				      SweetAlert.swal("¡Borrado!", "El cliente ha sido eliminado", "success");
				   } else {
				      SweetAlert.swal("Cancelado", "El cliente no ha sido eliminado", "error");
				   }
				});
				
			}
		}

		vm.getAllCtes()
	}
})()