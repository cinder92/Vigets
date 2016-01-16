var printer = require("printer"),
util = require('util');

(function(){
	'use strict'
	angular.module('Vigets').
	controller('printersCtrl',printersCtrl)
	printersCtrl.$inject = []

	function printersCtrl(){
		var vm = this

		vm.printersList = []

		vm.getInstalledPrinters = function(){
			var printers = printer.getPrinters();

			for(var i = 0; i < printers.length; i++){
				//console.log(printers[i].name)
				var printerInfo = { id : i, name : printers[i].name, default : printers[i].isDefault }

				vm.printersList.push(printerInfo)
			}

			savePrinter()
			//console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
		}

		function savePrinter(){
			//savePrinters
			localStorage.setItem('printers',JSON.stringify(vm.printersList))
		}

		vm.setAsDefault = function(id){
			if(_.isInteger(id)){
				var newArray = []
				_.forEach(vm.printersList,function(printer){
					var newInfo = {
						id : printer.id,
						name : printer.name,
						default : (id == printer.id) ? true : false
					}

					newArray.push(newInfo)
				})

				vm.printersList = newArray

				savePrinter()

				//list again
				getPrinterfromStorage()
			}else{
				return false
			}
		}

		function getPrinterfromStorage(){
			var printers = JSON.parse(localStorage.getItem('printers'))

			if(_.isObject(printers) && !_.isEmpty(printers)){
				vm.printersList = printers;
			}else{
				vm.getInstalledPrinters()
			}
		}

		getPrinterfromStorage()

		
	}
})()