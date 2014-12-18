angular
    .module('IrregularVerbsApp', ['ngRoute'])
    .controller('MainController', ['$scope', '$route', '$routeParams', '$location', function($scope, $route, $routeParams, $routeProvider, $location){
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    }])
    .controller('CollectionController', ['$scope', function($scope){
        $scope.words = localStorage.getItem('IrregularVerbs') ? angular.fromJson(localStorage.getItem('IrregularVerbs')) : window.words;

        $scope.addRow = function(){
            $scope.words.push(['', '', '', '', false]);
        };

        $scope.save = function(){
            localStorage.setItem('IrregularVerbs', angular.toJson($scope.words));
        };
    }])
    .controller('TrainingController', ['$scope', '$filter', function($scope, $filter){
        //+ Jonas Raoni Soares Silva
        //@ http://jsfromhell.com/array/shuffle [v1.0]
        var shuffle = function (o){ //v1.0
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };

        var getWords = function() {
            return shuffle($filter('filter')(
                angular.fromJson(localStorage.getItem('IrregularVerbs') || '[]'),
                function(value, index) {
                    return value[4] === true;
                }
            ));
        }

        var next = function(){
            $scope.showAnswerMode = false;
            $scope.answer = {infinitive: '', pastSimple: '', pastParticiple: ''};
            if ($scope.words.length > 0) {
                $scope.currentWord = $scope.words.shift();
                $scope.statistics[$scope.currentWord.translation] = false;
            } else {
                $scope.statisticSummary = {
                    count: _.keys($scope.statistics).length,
                    rightCount: _.filter($scope.statistics, function(value, key) { return value === true; }).length
                };
                $scope.statisticSummary.rightPersent = Math.round($scope.statisticSummary.rightCount / $scope.statisticSummary.count * 100);
                $scope.finishMode = true;
            }
            document.querySelectorAll('.classroom input')[0].focus();
        };

        $scope.start = function(){
            $scope.words = getWords();
            $scope.statistics = {};
            $scope.currentWord = $scope.words.shift();
            $scope.answer = {infinitive: '', pastSimple: '', pastParticiple: ''};
            $scope.lastCheckCorrect = false;
            $scope.lastCheckIncorrect = false;
            $scope.showAnswerMode = false;
            $scope.finishMode = false;
            $scope.noWordsMode = $scope.words.length == 0;
        };
        $scope.start();

        $scope.check = function(){
            $scope.infinitiveStatus = $scope.answer.infinitive == $scope.currentWord.infinitive;
            $scope.pastSimpleStatus = $scope.answer.pastSimple == $scope.currentWord.pastSimple;
            $scope.pastSimpleStatus = $scope.answer.pastParticiple == $scope.currentWord.pastParticiple;

            if ($scope.infinitiveStatus && $scope.pastSimpleStatus && $scope.pastSimpleStatus) {
                $scope.lastCheckCorrect = true;
                $scope.statistics[$scope.currentWord.translation] = true;
                next();
            } else {
                $scope.lastCheckIncorrect = true;
            }
        };

        $scope.showAnswers = function(){
            $scope.showAnswerMode = true;
        }

        $scope.nextWord = function(){
            $scope.lastCheckIncorrect = false;
            $scope.lastCheckCorrect = false;
            next();
        };

        $scope.$watchCollection('answer', function(){
            $scope.lastCheckCorrect = false;
            $scope.lastCheckIncorrect = false;
        });
    }])
    .config(function($routeProvider, $locationProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'collection.html',
                controller: 'CollectionController'
            })
            .when('/training/', {
                templateUrl: 'training.html',
                controller: 'TrainingController'
            });

        $locationProvider.html5Mode(true);
    });
