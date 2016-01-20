/*! angular-intro.js 2015-09-11 */
!function(a,b){"function"==typeof define&&define.amd?define(["angular","intro"],b):"object"==typeof exports?module.exports=b(require("angular"),require("intro")):a.angularIntroJs=b(a.angular,a.introJs)}(this,function(a,b){"object"==typeof b&&(b=b.introJs);var c=a.module("angular-intro",[]);return c.directive("ngIntroOptions",["$timeout",function(a){return{restrict:"A",scope:{ngIntroMethod:"=",ngIntroExitMethod:"=?",ngIntroNextMethod:"=?",ngIntroPreviousMethod:"=?",ngIntroOptions:"=",ngIntroOncomplete:"=",ngIntroOnexit:"=",ngIntroOnchange:"=",ngIntroOnbeforechange:"=",ngIntroOnafterchange:"=",ngIntroAutostart:"=",ngIntroAutorefresh:"="},link:function(c,d,e){var f;c.ngIntroMethod=function(d){var e=c.$on("$locationChangeStart",function(){f.exit()});f="string"==typeof d?b(d):b(),f.setOptions(c.ngIntroOptions),c.ngIntroAutorefresh&&c.$watch(function(){f.refresh()}),c.ngIntroOncomplete&&f.oncomplete(function(){c.ngIntroOncomplete.call(this,c),a(function(){c.$digest()}),e()}),c.ngIntroOnexit&&f.onexit(function(){c.ngIntroOnexit.call(this,c),a(function(){c.$digest()}),e()}),c.ngIntroOnchange&&f.onchange(function(b){c.ngIntroOnchange.call(this,b,c),a(function(){c.$digest()})}),c.ngIntroOnbeforechange&&f.onbeforechange(function(b){c.ngIntroOnbeforechange.call(this,b,c),a(function(){c.$digest()})}),c.ngIntroOnafterchange&&f.onafterchange(function(b){c.ngIntroOnafterchange.call(this,b,c),a(function(){c.$digest()})}),"number"==typeof d?f.goToStep(d).start():f.start()},c.ngIntroNextMethod=function(){f.nextStep()},c.ngIntroPreviousMethod=function(){f.previousStep()},c.ngIntroExitMethod=function(a){f.exit(),a()};var g=c.$watch("ngIntroAutostart",function(){c.ngIntroAutostart&&a(function(){c.ngIntroMethod()}),g()});c.$on("$locationChangeSuccess",function(){"undefined"!=typeof f&&f.exit()})}}}]),c});