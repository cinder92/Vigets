(function(){
	'use strict';
	angular.module('Vigets')
	.controller('clientesCtrl',clientesCtrl)
	clientesCtrl.$inject = [
		'$rootScope',
		'$state',
		'$webSql'
	]

	function clientesCtrl(
		$rootScope,
		$state,
		$webSql
	){
		var vm = this;

		vm.cteName;
		vm.cteAge;
		vm.cteEmail;
		vm.ctePhone;
		vm.cteFacebook;
		vm.cteTwitter;
		vm.catID;
		vm.pageSize = 5;
		vm.currentPage = 0;

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
						    vm.cteAge = vm.ctes[i].age;
							vm.cteEmail = vm.ctes[i].email;
							vm.ctePhone = vm.ctes[i].phone;
							vm.cteFacebook = vm.ctes[i].facebook;
							vm.cteTwitter = vm.ctes[i].twitter;
						    
						    vm.cteID = vm.ctes[i].id
				    	}
				    }
				    //vm.getAllProds()
				}
	    }

		vm.saveCte = function(){
			if(vm.cteName != undefined && vm.cteName != ""
				&& vm.ctePhone != undefined && vm.ctePhone != ""){

				var newCte = {
					name : vm.cteName,
					age : vm.cteAge,
					email : vm.cteEmail,
					phone : vm.ctePhone,
					facebook : vm.cteFacebook,
					twitter : vm.cteTwitter
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

				vm.cteName = "";
				vm.cteAge = "";
				vm.cteEmail = "";
				vm.ctePhone = "";
				vm.cteFacebook = "";
				vm.cteTwitter = "";
				vm.cteID = "";

			    vm.getAllCtes()

			}else{
				alert('Por favor escriba el nombre y el telefono del cliente')
			}
		}

		vm.delCte = function(index){
			//console.log(index)
			
			if(index != undefined && index > 0 && index != "" && index != null){
				var conf = confirm('Deseas eliminar este cliente?')

				if(conf){
					
				    vm.cteName = "";
					vm.cteAge = "";
					vm.cteEmail = "";
					vm.ctePhone = "";
					vm.cteFacebook = "";
					vm.cteTwitter = "";
					vm.cteID = "";
					$rootScope.db.del("clientes", {"id": index})
					vm.getAllCtes()
				}
				
			}
		}

		vm.getAllCtes()
	}
})()