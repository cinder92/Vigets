angular.module('Vigets',[
	'ui.router',
	//'LocalForageModule',
  'angular-websql',
  'drahak.hotkeys'
])

.run(function($hotkey,$rootScope,$webSql,$timeout){
  $rootScope.db = $webSql.openDatabase('VigetsDB', '1.0', 'Databse', 2 * 1024 * 1024);
  //alert('e')
  //$rootScope.db.del("productos", {"id": 3})
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

  $rootScope.db.createTable('permisos', {
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

  $rootScope.db.createTable('usuarios_permisos', {
    "id":{
      "type": "INTEGER",
      "null": "NOT NULL", // default is "NULL" (if not defined)
      "primary": true, // primary
      "auto_increment": true // auto increment
    },
    "usuario":{
      "type": "INTEGER",
      "null": "NOT NULL"
      //"default": "CURRENT_TIMESTAMP" // default value
    },
    "permiso":{
      "type": "INTEGER",
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
    "email":{
      "type": "TEXT",
      "null": "NOT NULL"
      //"default": "CURRENT_TIMESTAMP" // default value
    },
    "age":{
      "type": "DATE_FORMAT",
      "null": "NOT NULL"
      //"default": "CURRENT_TIMESTAMP" // default value
    },
    "phone":{
      "type": "TEXT",
      "null": "NOT NULL"
      //"default": "CURRENT_TIMESTAMP" // default value
    },
    "facebook":{
      "type": "TEXT",
      "null": "NOT NULL"
      //"default": "CURRENT_TIMESTAMP" // default value
    },
    "twitter":{
      "type": "TEXT",
      "null": "NOT NULL"
      //"default": "CURRENT_TIMESTAMP" // default value
    }
  })

  $rootScope.isLogin = false;

  //clock
  $rootScope.clock = "Cargando ..."; // initialise the time variable
  $rootScope.tickInterval = 1000 //ms

  var tick = function() {
      $rootScope.clock = Date.now() // get the current time
      $timeout(tick, $rootScope.tickInterval); // reset the timer
  }

  // Start the timer
  $timeout(tick, $rootScope.tickInterval);

  $rootScope.showOrder = false;
  var pic = 1;
  $hotkey.bind('Ctrl + N', function(event) {
       //lanzar pedido desde cualquier lado
       
       if(pic == 1){
         $rootScope.showOrder = true;
         pic = 2
         console.log(pic)
       }else{
         if(pic == 2){
          $rootScope.showOrder = false;
          pic = 1
           console.log(pic)
         }
         
       }
       
  })
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "app/templates/init.html",
    controller: 'initController as init'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "app/templates/sesion.html"
      }
    }
  })

  .state('app.dashboard', {
    url: "/dashboard",
    views: {
      'menuContent': {
        templateUrl: "app/templates/dashboard.html",
        controller: 'dashController as dash'
        //controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.categorias', {
    url: "/categorias",
    views: {
      'menuContent': {
        templateUrl: "app/templates/categorias.html",
        controller: 'catController as cat'
        //controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.clientes', {
    url: "/clientes",
    views: {
      'menuContent': {
        templateUrl: "app/templates/clientes.html",
        controller: 'clientesCtrl as clientes'
      }
    }
  })

  .state('app.usuarios', {
    url: "/usuarios",
    views: {
      'menuContent': {
        templateUrl: "app/templates/usuarios.html",
        controller: 'usuariosCtrl as usuarios'
      }
    }
  })

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});