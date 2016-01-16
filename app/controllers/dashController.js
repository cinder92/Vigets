(function(){
	angular.module('Vigets')
	.controller('dashController',dashController)
	dashController.$inject = [
		//'$localForage',
		'$rootScope',
		'$state',
		'$webSql',
		'$stateParams',
		'SweetAlert'
	]

	function dashController(
		//$localForage,
		$rootScope,
		$state,
		$webSql,
		$stateParams,
		SweetAlert
	){
		var vm = this;

		vm.prodName;
		vm.prodPrice;
		vm.prodCat;
		vm.prodID;

		vm.currentPage = 0;
	    vm.pageSize = 5;

	    var empty = $stateParams.empty

	    if(empty == "true"){
	    	SweetAlert.swal("Por favor agrega un producto");
	    }

		vm.getAllProds = function(){
			vm.productos = [];
			$rootScope.db.selectAll("productos").then(function(results) {
			  for(var i=0; i < results.rows.length; i++){
			    vm.productos.push(results.rows.item(i));
			  }
			})

			vm.categorias = []

			$rootScope.db.selectAll("categorias").then(function(results){
				for(var i=0; i < results.rows.length; i++){
				    vm.categorias.push(results.rows.item(i));
				  }
			})
		}

		vm.numberOfPages = function(){
	        return Math.ceil(vm.productos.length/vm.pageSize);                
	    }

	    vm.prodDetails = function(index){
	    		
	    		if(index != undefined && index > 0){
				    for(var i = 0; i < vm.productos.length; i++){
				    	if(vm.productos[i].id == index){
				    		vm.prodCat = vm.productos[i].category
						    vm.prodName = vm.productos[i].name
						    vm.prodPrice = vm.productos[i].price
						    vm.prodID = vm.productos[i].id
				    	}
				    }
				    //vm.getAllProds()
				}
	    }

		vm.saveProd = function(){
			if(vm.prodName != undefined 
				&& vm.prodCat != undefined 
				&& vm.prodPrice != undefined
				&& vm.prodName != ""
				&& vm.prodCat != ""
				&& vm.prodPrice != ""){

				var newProd = {
					name : vm.prodName,
					price : vm.prodPrice,
					category : vm.prodCat
				}

				//validar que se actualice el producto
				if(vm.prodID != null && vm.prodID != undefined && vm.prodID > 0 && vm.prodID != ""){
					//update
					//newProd.id = vm.prodID;
					$rootScope.db.update("productos", newProd, {
					  'id': vm.prodID 
					})
				}else{
					//create
					$rootScope.db.insert('productos', newProd).then(function(results) {
					  //console.log(results.insertId);
					  //vm.productos.push(newProd);
					})
				}

				vm.prodCat = ''
			    vm.prodName = ''
			    vm.prodPrice = ''
			    vm.prodID = ''

			    vm.getAllProds()


				

			}else{
				SweetAlert.swal({
					 title : "Oops!",
					 text: 'Por favor llene todos los campos',
					 type: "warning"
				})
				//alert('Llene todos los campos')
			}
		}

		vm.delProd = function(index){
			//console.log(index)
			
			if(index != undefined && index > 0 && index != "" && index != null){

				SweetAlert.swal({
				   title: "Aviso",
				   text: "¿Deseas eliminar este producto?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Si, borrar!",
				   cancelButtonText: "Cancelar",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
					   	vm.prodCat = ''
					    vm.prodName = ''
					    vm.prodPrice = ''
					    vm.prodID = ''
						$rootScope.db.del("productos", {"id": index})
						vm.getAllProds()
				      SweetAlert.swal("¡Borrado!", "El producto ha sido eliminado", "success");
				   } else {
				      SweetAlert.swal("Cancelado", "El producto no ha sido eliminado", "error");
				   }
				});
				
			}
		}

		vm.getAllProds()

	}
})();