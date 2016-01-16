(function(){
	angular.module('Vigets')
	.controller('catController',catController)
	catController.$inject = [
		'$rootScope',
		'$state',
		'$webSql',
		'$stateParams',
		'SweetAlert'
	]

	function catController(
		$rootScope,
		$state,
		$webSql,
		$stateParams,
		SweetAlert
	){
		var vm = this;

		vm.catName;
		vm.catID;
		vm.pageSize = 5;
		vm.currentPage = 0;

		 var empty = $stateParams.empty

	    if(empty == "true"){
	    	SweetAlert.swal("Por favor agrega una categoría");
	    }

		vm.getAllCats = function(){
			vm.categorias = [];
			$rootScope.db.selectAll("categorias").then(function(results) {
			  for(var i=0; i < results.rows.length; i++){
			    vm.categorias.push(results.rows.item(i));
			  }
			})
		}

		vm.numberOfPages = function(){
	        return Math.ceil(vm.categorias.length/vm.pageSize);                
	    }

	    vm.catDetails = function(index){
	    		
	    		if(index != undefined && index > 0){
				    for(var i = 0; i < vm.categorias.length; i++){
				    	if(vm.categorias[i].id == index){
				    		//vm.prodCat = vm.categorias[i].category
						    vm.catName = vm.categorias[i].name
						    //vm.prodPrice = vm.categorias[i].price
						    vm.catID = vm.categorias[i].id
				    	}
				    }
				    //vm.getAllProds()
				}
	    }

		vm.saveCat = function(){
			if(vm.catName != undefined){

				var newCat = {
					name : vm.catName
				}

				//validar que se actualice el producto
				if(vm.catID != null && vm.catID != undefined && vm.catID > 0 && vm.catID != ""){
					//update
					//newProd.id = vm.prodID;
					$rootScope.db.update("categorias", newCat, {
					  'id': vm.catID 
					})
				}else{
					//create
					$rootScope.db.insert('categorias', newCat).then(function(results) {
					  //console.log(results.insertId);
					  //vm.productos.push(newProd);
					})
				}

				vm.catName = ''
				vm.catID = ''

			    vm.getAllCats()


				

			}else{
				SweetAlert.swal({
					 title : "Oops!",
					 text: 'Por favor llene todos los campos',
					 type: "warning"
				})
				//alert('Llene todos los campos')
			}
		}

		vm.delCat = function(index){
			//console.log(index)
			
			if(index != undefined && index > 0 && index != "" && index != null){

				SweetAlert.swal({
				   title: "Aviso",
				   text: "¿Deseas eliminar esta categoría?",
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Si, borrar!",
				   cancelButtonText: "Cancelar",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
					   	vm.catName = ''
					    vm.catID = ''
						$rootScope.db.del("categorias", {"id": index})
						vm.getAllCats()
				      SweetAlert.swal("¡Borrado!", "La categoría ha sido eliminada", "success");
				   } else {
				      SweetAlert.swal("Cancelado", "La categoría no ha sido eliminada", "error");
				   }
				});
				
			}
		}

		vm.getAllCats()
	}
})();