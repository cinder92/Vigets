var fs = require('fs');
var nodemailer = require('nodemailer');

(function(){
	'use strict'
	angular.module('Vigets').
	controller('backUpCtrl',backUpCtrl)
	backUpCtrl.$inject = [
		'$rootScope',
		'SweetAlert'
	]

	function backUpCtrl($rootScope,SweetAlert){
		var vm = this,
		db_results = []
		vm.importFile
		vm.exportLoading = false
		vm.importLoading = false

		vm.exportDatabase = function(){

			vm.exportLoading = true

			$rootScope.db.selectAll("ordenes").then(function(results) {
			  var ordenes = {'table' : 'ordenes' , 'data' : []}
			  for(var i=0; i < results.rows.length; i++){
			   	ordenes.data.push(results.rows.item(i));
			  }
			  db_results.push(ordenes)

			  exportUsuarios()
			})

		}

		vm.importDatabase = function(){

			SweetAlert.swal({
			   title: "Importar base de datos",
			   text: "Esto eliminará toda la información actual y no podrá ser recuperada",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Si, borrar!",
			   cancelButtonText: "Cancelar",
			   closeOnConfirm: false,
			   closeOnCancel: false }, 
			function(isConfirm){ 
			   if (isConfirm) {
				   
				  importInfotoDB()
					
			   } else {
			      SweetAlert.swal("Cancelado", "La información está segura", "error");
			   }
			});
			
		}

		function importInfotoDB(){
			//console.log(vm.importFile)
			if(undefined != vm.importFile && null != vm.importFile && vm.importFile.data != ''){

				var db = JSON.parse(vm.importFile.data)
				if(_.isArray(db)){

					resetDatabase()

					_.forEach(db,function(obj,i){
						//insertar toda la info en las tablas
						//console.log(obj.table,obj.data)
						if(obj.table != '' && !_.isEmpty(obj.data)){
							
							_.forEach(obj.data,function(results,j){
								//console.log(obj.table,key,val)
								$rootScope.db.insert(obj.table,results)
							})
							//
						}
						//obj.tabla
					})

					SweetAlert.swal("¡Bien!", "Base de datos restaurada", "success");

				}else{
					SweetAlert.swal("Error","Base de datos inválida","error");
				}
				//console.log(db)

			}else{
				SweetAlert.swal("Error","Por favor selecciona un archivo de respaldo","error");
			}
		}

		function resetDatabase(){

			  //borrar las tablas
			  $rootScope.db.dropTable('clientes')
			  $rootScope.db.dropTable('usuarios')
			  $rootScope.db.dropTable('ordenes')
			  $rootScope.db.dropTable('productos')
			  $rootScope.db.dropTable('categorias')

			  //crearlas de nuevo
			  $rootScope.db.createTable('ordenes', {
			    "id":{
			      "type": "INTEGER",
			      "null": "NOT NULL", // default is "NULL" (if not defined)
			      "primary": true, // primary
			      "auto_increment": true // auto increment
			    },
			    "client_id":{
			      "type": "INTEGER",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "date":{
			      "type": "DATE_FORMAT",
			      "null": "NOT NULL"
			    },
			    "productos": {
			      "type": "TEXT",
			      "null": "NOT NULL"
			    },
			    "total" : {
			      "type" : "INTEGER",
			      "null" : "NOT NULL"
			    }
			  })

			  //tabla de productos
			  $rootScope.db.createTable('productos', {
			    "id":{
			      "type": "INTEGER",
			      "null": "NOT NULL", // default is "NULL" (if not defined)
			      "primary": true, // primary
			      "auto_increment": true // auto increment
			    },
			    "name":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "price":{
			      "type": "INTEGER",
			      "null": "NOT NULL"
			    },
			    "category": {
			      "type": "TEXT",
			      "null": "NOT NULL"
			    }
			  })

			  //categorias
			  $rootScope.db.createTable('categorias', {
			    "id":{
			      "type": "INTEGER",
			      "null": "NOT NULL", // default is "NULL" (if not defined)
			      "primary": true, // primary
			      "auto_increment": true // auto increment
			    },
			    "name":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    }
			  })

			  //categorias
			  $rootScope.db.createTable('usuarios', {
			    "id":{
			      "type": "INTEGER",
			      "null": "NOT NULL", // default is "NULL" (if not defined)
			      "primary": true, // primary
			      "auto_increment": true // auto increment
			    },
			    "name":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "email":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "password":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    }
			  })

			  //categorias
			  $rootScope.db.createTable('clientes', {
			    "id":{
			      "type": "INTEGER",
			      "null": "NOT NULL", // default is "NULL" (if not defined)
			      "primary": true, // primary
			      "auto_increment": true // auto increment
			    },
			    "name":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "direccion":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "email":{
			      "type": "TEXT",
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "age":{
			      "type": "DATE_FORMAT",
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "phone":{
			      "type": "TEXT",
			      "null": "NOT NULL"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "facebook":{
			      "type": "TEXT"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    },
			    "twitter":{
			      "type": "TEXT"
			      //"default": "CURRENT_TIMESTAMP" // default value
			    }
			  })
		}

		function exportUsuarios(){
			$rootScope.db.selectAll("usuarios").then(function(results) {
			  var usuarios = {'table' : 'usuarios' , 'data' : []}
			  for(var i=0; i < results.rows.length; i++){
			   	usuarios.data.push(results.rows.item(i));
			  }
			  db_results.push(usuarios)

			  exportProductos()
			})
		}

		function exportProductos(){
			$rootScope.db.selectAll("productos").then(function(results) {
			  var productos = {'table' : 'productos' , 'data' : []}
			  for(var i=0; i < results.rows.length; i++){
			   	productos.data.push(results.rows.item(i));
			  }
			  db_results.push(productos)

			  exportCategorias()
			})
		}

		function exportCategorias(){
			$rootScope.db.selectAll("categorias").then(function(results) {
			  var categorias = {'table' : 'categorias' , 'data' : []}
			  for(var i=0; i < results.rows.length; i++){
			   	categorias.data.push(results.rows.item(i));
			  }
			  db_results.push(categorias)

			  exportClientes()
			})
		}

		function exportClientes(){
			$rootScope.db.selectAll("clientes").then(function(results) {
			  var clientes = {'table' : 'clientes' , 'data' : []}
			  for(var i=0; i < results.rows.length; i++){
			   	clientes.data.push(results.rows.item(i));
			  }
			  db_results.push(clientes)

			  exportOrdenes()
			})
		}

		function exportOrdenes(){
			$rootScope.db.selectAll("ordenes").then(function(results) {
			  var ordenes = {'table' : 'ordenes' , 'data' : []}
			  for(var i=0; i < results.rows.length; i++){
			   	ordenes.data.push(results.rows.item(i));
			  }
			  db_results.push(ordenes)


			  	sendFile()
			})
		}

		function sendFile(){
			var date = new Date(),
			curDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
			fileName = 'vigetsDb-'+curDate+'.txt',
			database = fs.writeFileSync('/tmp/'+fileName,JSON.stringify(db_results))//JSON.stringify(db_results)
			// crear un objeto de transporte reutilizable usando SMTP transport
			var transporter = nodemailer.createTransport({
			    service: 'Gmail',
			    auth: {
			        user: 'cegodai@gmail.com',
			        pass: 'zgalqoywkwuowhkp'
			    }
			});
			 
			// configura los datos del correo
			var mailOptions = {
			    from: 'Vigets Backup <cegodai@gmail.com>', to: 'contacto@dantecervantes.com',
			    subject: 'Respaldo de Base de datos | Vigets',
			    //text: ',
			    html: '<b>Hola, aquí está el respaldo del día <strong>'+curDate+'</strong></b>',
			    attachments : [
			    	{
			    		name : fileName,
			    		path : '/tmp/'+fileName
			    	}
			    ]
			};
			 
			// Envía el correo con el objeto de transporte definido anteriormente
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        return console.log(error);
			    }
			 	
			});

			SweetAlert.swal({
				 title : "¡Genial!",
				 text: 'El respaldo ha sido generado exitosamente',
				 type: "success"
			})

			vm.exportLoading = false

		}
	}
})()