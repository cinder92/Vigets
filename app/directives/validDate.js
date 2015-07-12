var app = angular.module('Vigets');
app.directive('validDate', function ($filter, $window, $parse, $timeout) {
return {
    require: '?ngModel',
    restrict: 'A',
    compile: function () {
        var moment = $window.moment;
        var getter, setter;
        return function (scope, element, attrs, ngModel) {
            //Declaring the getter and setter
            getter = $parse(attrs.ngModel);
            setter = getter.assign;
            //Set the initial value to the View and the Model
            ngModel.$formatters.unshift(function (modelValue) {
                if (!modelValue) return "";
                var retVal = $filter('date')(modelValue, "MM/dd/yyyy");
                setter(scope, retVal);
                console.log('Set initial View/Model value from: ' + modelValue + ' to ' + retVal);
                return retVal;
            });

            // If the ngModel directive is used, then set the initial value and keep it in sync
            if (ngModel) {
                element.on('blur', function (event) {
                    var date = moment($filter('date')(element.val(), "MM/dd/yyyy"));
                    // if the date entered is a valid date then save the value
                    if (date && moment(element.val(), "MM/DD/YYYY").isValid() && date <= moment() && date >= moment("01/01/1900")) {
                        //element.css('background', 'white');
                        element[0].value = $filter('date')(date.toDate(), "MM/dd/yyyy");
                        console.log('change value to ' + element.val());
                        var newValue = element.val();
                        scope.$apply(function () {
                            setter(scope, newValue);
                        });
                    } else { //show an error and clear the value
                        console.log('INCORRECT VALUE ENTERED');
                        //element.css('background', 'pink');
                        element[0].value = "";
                        scope.$apply(function () {
                            setter(scope, '');
                        });
                    }
                });
             }
         };
      }
  }; });