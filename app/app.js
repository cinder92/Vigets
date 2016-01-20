var remote = require('remote'); 
var BrowserWindow = remote.require('browser-window'); 
/*var notifier = require('node-notifier');
notifier.notify({
  'title': 'My notification',
  'message': 'Hello, there!',
  'sound' : 'Glass'
});*/

angular.module('Vigets',[
	'ui.router',
	//'LocalForageModule',
  'angular-websql',
  'drahak.hotkeys',
  'chart.js',
  'countTo',
  'angulartics',
  'angulartics.google.analytics',
  '720kb.datepicker',
  'oitozero.ngSweetAlert',
  'ng-file-model',
  'angular-intro'
])

.run(function($rootScope,$webSql,$timeout){

  $rootScope.db = $webSql.openDatabase('VigetsDB', '1.0', 'Databse', 2 * 1024 * 1024);
  //alert('e')
  //$rootScope.db.del("productos", {"id": 3})
  //tabla de orden
  /*$rootScope.db.dropTable('clientes')
  $rootScope.db.dropTable('ordenes')
  $rootScope.db.dropTable('reportes')
  $rootScope.db.dropTable('productos')
  $rootScope.db.dropTable('categorias')*/
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

  $rootScope.db.createTable('ajustes', {
    "id":{
      "type": "INTEGER",
      "null": "NOT NULL", // default is "NULL" (if not defined)
      "primary": true, // primary
      "auto_increment": true // auto increment
    },
    "ajustes":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "user_id":{
      "type" : 'INTEGER',
      "null" : "NOT NULL"
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

  //buttons     
  $rootScope.min = function(){
    var window = BrowserWindow.getFocusedWindow();
    window.minimize();
  }

  $rootScope.max = function(){
    var window = BrowserWindow.getFocusedWindow();
    window.maximize();
  }

  $rootScope.close = function(){
    var window = BrowserWindow.getFocusedWindow();
    window.close();
  }

  $rootScope.intro = {
      steps:[
        {
            element: '#produtosIntro',
            intro: "Esta es la sección de productos, aquí tienes el catálogo y la información de cada producto en stock",
        },
        {
            element: '#categoriasIntro',
            intro: "En esta sección encontrarás las categorías a las que están ligadas los productos"
        },
        {
          element : '#clientesIntro',
          intro : 'En el módulo de clientes, puedes revisar cuantos clientes tienes hasta ahora, editarlos, añadir nuevos y exportarlos en distintos formatos para su posterior uso.'
        },
        {
          element : '#reportesIntro',
          intro : 'Los reportes son los que te indican cuantas ventas llevas hasta ahora, el cliente que más compras realiza y las ganancias del día de hoy'
        },
        {
          element : '#ordenesIntro',
          intro : 'El listado de órdenes / pedidos, te da un detalle más avanzado de las mismas'
        },{
          element : '#usuariosIntro',
          intro : 'Los usuarios son los que podrán acceder a Vigets, ¡agrega cuantos quieras!'
        },{
          element : '#ajustesIntro',
          intro : 'Aquí podrás visualizar las impresoras conectadas a tu computadora, respaldar la base de datos y muchas otras cosas!'
        },
        {
          element : '#nuevaOrdenIntro',
          intro : "Con este botón puedes realizar una orden de compra",
          position : 'top'
        }
      ],
      showBullets : false,
      nextLabel : 'Siguiente',
      prevLabel : 'Anterior',
      skipLabel : 'Saltar intro',
      doneLabel : 'Terminar',
      exitOnEsc : false,
      showStepNumbers : false,
      disableInteraction : true
    }

  $rootScope.startIntroAtlogin = false



  
})

.config(function($httpProvider,$stateProvider, $urlRouterProvider, $analyticsProvider) {
  //analytics
  // turn off automatic tracking
  $analyticsProvider.virtualPageviews(false);
  
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

  .state('app.install', {
    url: "/install",
    views: {
      'menuContent': {
        templateUrl: "app/templates/install.html",
        controller : "installCtrl as install"
      }
    }
  })

  .state('app.dashboard', {
    url: "/dashboard:empty",
    views: {
      'menuContent': {
        templateUrl: "app/templates/dashboard.html",
        controller: 'dashController as dash'
        //controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.categorias', {
    url: "/categorias:empty",
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

  .state('app.ordenes', {
    url: "/ordenes",
    views: {
      'menuContent': {
        templateUrl: "app/templates/ordenes.html",
        controller: 'ordersCtrl as orden'
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "app/templates/settings.html"
      }
    }
  })

  .state('app.settings.general',{
    url : '/settings/general',
    views : {
      'settingsWrapper':{
        templateUrl : 'app/templates/settings-general.html',
        controller: 'settingsCtrl as settings'
      }
    }
  })

  .state('app.settings.printers',{
    url : '/settings/printers',
    views : {
      'settingsWrapper':{
        templateUrl : 'app/templates/settings-printers.html',
        controller: 'printersCtrl as printers'
      }
    }
  })

  .state('app.settings.backup',{
    url : '/settings/backup',
    views : {
      'settingsWrapper':{
        templateUrl : 'app/templates/settings-backup.html',
        controller: 'backUpCtrl as backup'
      }
    }
  })

  

  .state('app.reportes', {
    url: "/reportes",
    views: {
      'menuContent': {
        templateUrl: "app/templates/reportes.html",
        controller: 'reportesCtrl as reportes'
      }
    }
  })

 

    //hasta que no se encuentre una forma de utulizar la base de datos
    //en esta sección, se utilizará localStorage

    var localUsers = JSON.parse(localStorage.getItem('have_users'))
    console.log(localUsers)
    
    // if none of the above states are matched, use this as the fallback
    //undefined != localUsers && null != localUsers && localUsers == "true"
    if(undefined != localUsers && null != localUsers && localUsers == true){
       $urlRouterProvider.otherwise('/app/home');
    }else{
       $urlRouterProvider.otherwise('/app/install');
    }

  
});