(function(){
	'use strict'
	angular.module('Vigets').
	controller('reportesCtrl',reportesCtrl)
	reportesCtrl.$inject = [
		'$rootScope'
	]

	function reportesCtrl($rootScope){
		var vm = this

		vm.labels = ['No data']//["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  		vm.data = ['1']//[300, 500, 100];
  		vm.opts = {
  			segmentShowStroke : false
  		}
  		vm.mayor_comprador_name
  		vm.mayor_comprador_tel
  		vm.colors = ['#CC324B','#FFBC4D','#4FC4F6','#0CB1B1','#1F253D']
  		vm.ganancias_hoy

  		vm.getTotalVendidos = function(prods){

  			var args = []
  			//productos completos console.log(prods) 
			//obtener el precio total de la compra
			_.forEach(prods, function(n, key) {
			  		for(var i = 0; i < n.length; i++){
			  			args.push(n[i])
			  		}
			});

			var group = _.groupBy(args,'id'),
			maxProdSelled = [],
			totalCant = 0,
			totalPrice = 0
			,nameprod = ''

			//console.log(group)


			for (var key in group) {
			  if (group.hasOwnProperty(key)) {
			    if(group[key].length >= 2){
			    	maxProdSelled.push(group[key])
			    }
			  }
			}

			//console.log(maxProdSelled)
			vm.labels = []
			vm.data = []
			_.forEach(maxProdSelled, function(n, key) {

			  		for(var i = 0; i < n.length; i++){
			  			totalCant = parseInt(totalCant + n[i].cant)
			  			nameprod = n[i].name
			  		}

			  		vm.labels.push(nameprod)
					vm.data.push(totalCant)

			});
			
  		}

  		vm.getProductosMasVendido = function(){
  			$rootScope.db.selectAll("ordenes").then(function(results) {
			  var productos = [];
			  for(var i=0; i < results.rows.length; i++){
			    productos.push(JSON.parse(results.rows.item(i).productos));
			  }

			  vm.getTotalVendidos(productos)
			})
  		}

  		vm.getMayorComprador = function(){
  			$rootScope.db.selectAll("ordenes").then(function(results) {
			  var ordenes = [];
			  for(var i=0; i < results.rows.length; i++){
			    ordenes.push(results.rows.item(i));
			  }

			  var group = _.groupBy(ordenes,'client_id'),
			  client_id = 0
			  
			  	for (var key in group) {
				  if (group.hasOwnProperty(key)) {
				    client_id = group[key][0].client_id
				  }
				}

				$rootScope.db.select("clientes", {
				  "id": {
				    "value":client_id
				  }
				}).then(function(results) {
				  
				  for(i=0; i < results.rows.length; i++){
				    vm.mayor_comprador_name = results.rows.item(i).name;
				    vm.mayor_comprador_tel = results.rows.item(i).phone;
				  }
				})

			})
  		}

  		vm.getGananciasHoy = function(){
  			var date = new Date(),
  			today = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()
  			console.log(today)
  			$rootScope.db.select("ordenes", {
			  "date": {
			    "value": today
			  }
			}).then(function(results) {
			  var total = 0
			  for(var i=0; i < results.rows.length; i++){
			    total = (total + results.rows.item(i).total)
			  }

			  vm.ganancias_hoy = total
			  
			})
  		}

  		vm.getGananciasHoy()
  		vm.getProductosMasVendido()
  		vm.getMayorComprador()
	}
})()