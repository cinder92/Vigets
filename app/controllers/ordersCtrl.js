(function(){
	'use strict'
	angular.module('Vigets')
	.controller('ordersCtrl',ordersCtrl)
	ordersCtrl.$inject = [
		'$rootScope',
		'$webSql',
		'$q'
	]

	function ordersCtrl($rootScope,$webSql,$q){
		var vm = this
		vm.ordersList = []
		vm.pageSize = 5
		vm.currentPage = 0;
		vm.detailsPopup = false
		vm.productsInOder = []
		vm.orderTotalPrice = 0

		vm.numberOfPages = function(){
	        return Math.ceil(vm.ordersList.length/vm.pageSize);                
	    }

		vm.getOrders = function(){
			$rootScope.db.selectAll("ordenes").then(function(results) {
			  
			  for(var i=0; i < results.rows.length; i++){
				vm.setClientName(results.rows.item(i))
			  }

			})
		}

		vm.setClientName = function(ordenes){

			var getName = vm.getClientName(ordenes.client_id)
		    var name = ''
		    getName.then(function(clientName){
		  		ordenes.name = (undefined != clientName && null != clientName && clientName != '') ? clientName : 'Desconocido'
			    vm.ordersList.push(ordenes)
		    });

		}

		vm.getClientName = function(clientId){

			var defered = $q.defer();
			
			$rootScope.db.select("clientes", {
			  "id":{
			  	value : clientId
			  }
			}).then(function(results) {
			  var name = ''
			  for(var i=0; i < results.rows.length; i++){
			   
			   name = results.rows.item(i).name
			  }
			   defered.resolve(name)
			})
			
			return defered.promise
		}

		vm.setOrderDetails = function(prods){
			vm.productsInOder = []

			for(var i = 0; i < prods.length; i++){
				vm.productsInOder.push(prods[i])
			}
			var total = 0
			//obtener el precio total de la compra
			_.forEach(prods, function(n, key) {
			  	
			  	total = (total + (parseInt(n.price) * n.cant ));
			});
			
			vm.orderTotalPrice = total
		}

		vm.viewDetails = function(orderId){
			if(undefined != orderId && null != orderId && orderId > 0){
				vm.detailsPopup = true

				//obtener los productos de la orden
				$rootScope.db.select("ordenes",{
					"id": {
						value : orderId
					}
				}).then(function(results){
					for(var i = 0; i < results.rows.length; i++){
						var prods = JSON.parse(results.rows.item(i).productos);
						vm.setOrderDetails(prods)
						vm.orderId = orderId
					}
				})
			}
		}

		vm.getOrders()
	}
})()