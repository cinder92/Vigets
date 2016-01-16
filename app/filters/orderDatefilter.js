(function(){
	'use strict'
	angular.module('Vigets').
	filter('orderDate',orderDate)
	orderDate.$inject = []

	function orderDate(){
		return function(orders,date){

			var results = [];
	        var itemMatch = new RegExp(date, 'i');
	        for (var i = 0; i < orders.length; i++) {
	            var item = orders[i];
	            if ( itemMatch.test(item.date) ) {
	                results.push(item);
	            }
	        }
	        return results;

		}
	}
})()