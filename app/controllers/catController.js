(function(){
	angular.module('Vigets')
	.controller('catController',catController)
	catController.$inject = [
		'$rootScope',
		'$state',
		'$webSql'
	]

	function catController(
		$rootScope,
		$state,
		$webSql
	){
		var vm = this;

		vm.catName;
		vm.catID;
		vm.pageSize = 5;
		vm.currentPage = 0;

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
				alert('Llene todos los campos')
			}
		}

		vm.delCat = function(index){
			//console.log(index)
			
			if(index != undefined && index > 0 && index != "" && index != null){
				var conf = confirm('Deseas eliminar esta categoría?')

				if(conf){
					
				    vm.catName = ''
				   
				    vm.catID = ''
					$rootScope.db.del("categorias", {"id": index})
					vm.getAllCats()
				}
				
			}
		}

		vm.getAllCats()
	}
})();