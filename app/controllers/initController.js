(function(){
	angular.module('Vigets')
	.controller('initController',initController)
	initController.$inject = [
		'$rootScope',
		'$state',
		'$webSql',
		'$hotkey',
		'$timeout',
		'SweetAlert',
		'$compile',
		'$scope'
	]

	function initController(
		$rootScope,
		$state,
		$webSql,
		$hotkey,
		$timeout,
		SweetAlert,
		$compile,
		$scope
	){
		var vm = this;

		vm.userMail;
		vm.userPass;
		vm.users = []
		vm.showCreateNewClient = false
		vm.newClientName
		vm.newClientAddress



		vm.login = function(){
			//$rootScope.isLogin = true;
			var success = false;
				if(vm.userPass != undefined && vm.userPass != ""
					&& vm.userMail != undefined && vm.userMail != ""){



					$rootScope.db.select("usuarios", {
					  "email": {
					    "value":vm.userMail,
					    "union":'AND'
					  },
					  "password":vm.userPass
					}).then(function(results) {
					  
						if(results.rows.length > 0){
						   $rootScope.current_user_id = results.rows.item(0).id

						    vm.userMail = "";
							vm.userPass = "";
					    	$rootScope.isLogin = true;
					    	//vm.startIntroAtlogin = true
					    	$state.go('app.dashboard')
					    	vm.startIntroAtlogin()
						}else{
					    	$rootScope.isLogin = false;
					    	//console.log('Oops!')
					    	SweetAlert.swal({
								 title : "Oops!",
								 text: 'Usuario ó contraseña incorrectos',
								 type: "error"
							})
					    }

					  
					})
				

				}else{
					SweetAlert.swal({
						 title : "Oops!",
						 text: 'Por favor escribe tu usuario / contraseña',
						 type: "warning"
					})
					//alert('Por favor escribe tu usuario y contraseña')
				}
			//$state.go('app.dashboard')
		}

		vm.startIntroAtlogin = function(){
			angular.element(document.getElementById('spaceforIntroBtn')).append($compile("<div><button ng-click='startTour();' style='display:none' on-load-clicker>startIntro</button></div>")($scope));
		}

		vm.setTourSettings = function(){
			SweetAlert.swal({
			   title: "Aviso",
			   text: "¿Deseas reproducir la introducción cada vez que inicies?",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Si",
			   cancelButtonText: "No",
			   closeOnConfirm: true,
			   closeOnCancel: true }, 
			function(isConfirm){ 
			   var vigets_settings = {
		   	  	 user_id : $rootScope.current_user_id,
		   	  	 ajustes : []
		   	   }
			   if (isConfirm) {
			   	  vigets_settings.ajustes.push({always_show_intro : false})
			      $rootScope.db.insert('ajustes',vigets_settings)
			   }else{
			   	 vigets_settings.ajustes.push({always_show_intro : true})
			      $rootScope.db.insert('ajustes',vigets_settings)
			   }
			});

		}

		vm.logout = function(){

			SweetAlert.swal({
			   title: "Aviso",
			   text: "¿Deseas salir?",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Si",
			   cancelButtonText: "No",
			   closeOnConfirm: true,
			   closeOnCancel: true }, 
			function(isConfirm){ 
			   if (isConfirm) {
			      $rootScope.isLogin = false;
				  $state.go('app.home')
			   } 
			});
		}

		vm.productos = []
		vm.prodsInOrder = []
		vm.totalPrice = 0;
		vm.clientInfo = {}
		vm.createNewOrder = function(){

			$rootScope.db.selectAll("productos").then(function(results) {
			  for(var i=0; i < results.rows.length; i++){
			    vm.productos.push(results.rows.item(i));
			  }

			  if(vm.productos.length > 0){
			  	$rootScope.showOrder = true;
			  }else{
			  	 //redirigir a añadir un producto

			  	 $rootScope.db.selectAll('categorias').then(function(cats){
			  	 	 if(cats.rows.length == 0){
			  	 	 	 $state.go('app.categorias',{'empty' : true})
			  	 	 }else{
			  	 	 	 $state.go('app.dashboard',{'empty' : true})
			  	 	 }
			  	 })

			  	
			  }

			})
			
		}

		vm.cancelOrder = function(){

			SweetAlert.swal({
			   title: "Aviso",
			   text: "¿Deseas cancelar la orden?",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Si, cancelar!",
			   cancelButtonText: "No",
			   closeOnConfirm: true,
			   closeOnCancel: true }, 
			function(isConfirm){ 
			   if (isConfirm) {
			      vm.productos = []
					vm.prodsInOrder = []
					vm.totalPrice = 0;
					vm.clientInfo = {}
					vm.clientInput =''
					vm.newClientAddress = ''
					$rootScope.showOrder = false
			   } 
			});
		}

		vm.resetFields = function(){
			vm.productos = []
			vm.prodsInOrder = []
			vm.totalPrice = 0;
			vm.clientInfo = {}
			vm.clientInput =''
			vm.showCreateNewClient = false
			$rootScope.showOrder = false
			vm.newClientName = ''
		}

		vm.addToOrder = function(prodid){
			//buscar el producto en los productos actuale de la orden
			var inOrder = _.find(vm.prodsInOrder,{'id':prodid});
			if(undefined == inOrder || null == inOrder || inOrder == ''){
				//no se encuentra, debemos agregarlo
				var prodInfo = _.find(vm.productos, { 'id': prodid });
				
				var addProd = {
					id : prodInfo.id,
					name : prodInfo.name,
					price : prodInfo.price,
					cant : 1
				}

				vm.prodsInOrder.push(addProd)
			}else{
				//añadir un producto adicional al ya existente
				inOrder.cant = (parseInt(inOrder.cant) + 1)
				console.log(inOrder)
			}
			var total = 0;
			//obtener el precio total de la compra
			_.forEach(vm.prodsInOrder, function(n, key) {
			  	
			  	total = (total + (parseInt(n.price) * n.cant ));
			});

			vm.totalPrice = total
		}
		var tempArticleSearchTerm;
		vm.searchClient = function(e){
			vm.showCreateNewClient = false
			vm.newClientName = ''
			vm.newClientAddress = ''
			if(undefined != e && null != e && e != ''){

				tempArticleSearchTerm = e;

			    $timeout(function () {
			        if (e == tempArticleSearchTerm) {
			            //function you want to execute after 250ms, if the value as changed
			            var users = []
						$rootScope.db.selectAll("clientes").then(function(results) {
						  for(var i=0; i < results.rows.length; i++){
						    users.push(results.rows.item(i));
						  }

						  //filtrar clientes unico por el teléfono
							var cliente = _.find(users, { 'phone': e })

							if(undefined != cliente || null != cliente){
								vm.clientInfo.name = cliente.name
								vm.clientInfo.facebook = (undefined == cliente.facebook) ? null : cliente.facebook ;
								vm.clientInfo.twitter = (undefined == cliente.twitter) ? null : cliente.twitter;
								vm.clientInfo.email = cliente.email
								vm.clientInfo.id = cliente.id
								//validar que sea el dia de hoy y mostrar un ícono de cumpleaños
								//vm.clientInfo.birth = cliente.age
							}else{
								vm.clientInfo = {}
								vm.showCreateNewClient = true
								//aquí debe aparecer el campo para agregar el nombre del cliente y
								//utilizar los componentes existentes para crear uno nuevo
								//alert('El cliente no existe, desea agregarlo?')
							}
						});
					}
				},1000)
			}
		}

		vm.payNow = function(){
			if(undefined != vm.prodsInOrder && null != vm.prodsInOrder && vm.prodsInOrder.length > 0
				&& vm.totalPrice > 0 && undefined != vm.clientInfo && null != vm.clientInfo && Object.keys(vm.clientInfo).length > 0){
				
				var fecha = new Date(),
				curDate = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear(),
				newOrder = {
					client_id : vm.clientInfo.id,
					date : curDate,
					productos : JSON.stringify(vm.prodsInOrder),
					total : vm.totalPrice
				}


				$rootScope.db.insert('ordenes', newOrder).then(function(results) {
					 SweetAlert.swal("¡Bien!", "Orden generada con éxito", "success");
					 //alert('La orden ha sido generada correctamente')
					 vm.resetFields()
				})

			}else{

				//validar que se haya escrito el nombre de algún cliente en el 
				//campo seleccionado
				if(undefined != vm.newClientName && null != vm.newClientName && vm.newClientName !=''
					&& undefined != vm.clientInput && null != vm.clientInput && vm.clientInput != ''
					&& undefined != vm.prodsInOrder && null != vm.prodsInOrder && vm.prodsInOrder.length > 0
					&& vm.totalPrice > 0
					&& undefined != vm.newClientAddress && null != vm.newClientAddress && vm.newClientAddress != ''){

					//se debe crear el cliente nuevo
					var clientInfo = {
						name : vm.newClientName,
						phone : vm.clientInput,
						direccion : vm.newClientAddress
					}
					$rootScope.db.insert('clientes',clientInfo).then(function(client){
						//crear la orden asignada a este cliente
						var new_client_id = client.insertId

						var fecha = new Date(),
						curDate = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear(),
						newOrder = {
							client_id : new_client_id,
							date : curDate,
							productos : JSON.stringify(vm.prodsInOrder),
							total : vm.totalPrice
						}


						$rootScope.db.insert('ordenes', newOrder).then(function(results) {
							 SweetAlert.swal("¡Bien!", "Orden generada correctamente", "success");
							 //alert('La orden ha sido generada correctamente')
							 vm.resetFields()
						})
					})

					

				}else{
					SweetAlert.swal("¡Aviso!", "Por favor elija productos para la orden / Seleccione y/ó busque un cliente", "error");
					//alert('Por favor elija productos para la orden / Seleccione y/ó busque un cliente')
				}
				
			}
			
		}

		var pic = 1;
		$hotkey.bind('Ctrl + N', function(event) {
		       //lanzar pedido desde cualquier lado
		       
		       if(pic == 1){
		       	 vm.createNewOrder()
		         pic = 2
		         
		       }else{
		         if(pic == 2){
		         	vm.cancelOrder()
		          pic = 1
		         }
		         
		       }
		       
		 })

		$hotkey.bind('Ctrl + E', function(event) {
		       //lanzar pedido desde cualquier lado
		       
		       vm.logout()
		       
		 })

		//menus
		var remote = require('remote');
		var Menu = remote.require('menu');
		var template = [
		  {
		    label: 'Vigets',
		    submenu: [
		      {
		        label: 'Acerca de Vigets',
		        selector: 'orderFrontStandardAboutPanel:'
		      },
		      {
		        type: 'separator'
		      },
		      {
		        label: 'Ocultar Vigets',
		        accelerator: 'Command+H',
		        selector: 'hide:'
		      },
		      {
		        label: 'Salir',
		        accelerator: 'Command+Q',
		        selector: 'terminate:'
		      },
		    ]
		  },
		  {
		    label: 'Herramientas',
		    submenu: [
		      {
		        label: 'Crear nueva orden',
		        accelerator: 'Ctrl + N',
		        click: function() { 
		        	if($rootScope.isLogin == true){
		        		vm.createNewOrder()
		        	}
		        }
		      },{
		        label : 'Cerrar Sesión',
		        accelerator : 'Ctrl + E',
		        click : function(){
		        	if($rootScope.isLogin == true){
		        		vm.logout()
		        	}
		        }
		      },
		      {
		        label : 'Enviar Feedback',
		        accelerator : 'Ctrl + F',
		        click : function(){
		        	window.location.href = "mailto:contacto@dantecervantes.com";
		        }
		      },
		      {
		        type: 'separator'
		      },
		      {
		      	label : 'Ver Productos',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.dashboard')
		      		}
		      	}
		      },
		      {
		      	label : 'Ver Categorías',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.categorias')
		      		}
		      	}
		      },
		      {
		      	label : 'Ver Órdenes',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.ordenes')
		      		}
		      	}
		      },
		      {
		      	label : 'Ver Clientes',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.clientes')
		      		}
		      	}
		      },
		      {
		      	label : 'Ver Reportes',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.reportes')
		      		}
		      	}
		      },
		      {
		      	label : 'Ver Usuarios',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.usuarios')
		      		}
		      	}
		      },
		      {
		      	type : 'separator'
		      },
		      {
		      	label : 'Respaldar Info. (wip)'
		      },
		      {
		      	label : 'Ajustes',
		      	click : function(){
		      		if($rootScope.isLogin == true){
		      			$state.go('app.settings')
		      		}
		      	}
		      }
		    ]
		  },
		  {
		    label: 'Ventana',
		    submenu: [
		      {
		        label: 'Minimizar',
		        accelerator: 'Command+M',
		        selector: 'performMiniaturize:'
		      },
		      {
		        label: 'Cerrar',
		        accelerator: 'Command+W',
		        selector: 'performClose:'
		      },
		      {
		        type: 'separator'
		      },
		      {
		        label: 'Traer al frente',
		        selector: 'arrangeInFront:'
		      }
		    ]
		  }
		];

		menu = Menu.buildFromTemplate(template);

		Menu.setApplicationMenu(menu);
	}
})();