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
            $scope.verbs.first = '';
            $scope.verbs.second = '';
            $scope.verbs.third = '';
            if ($scope.words.length > 0) {
                $scope.currentWord = $scope.words.shift();
            } else {
                alert('Good, start again');
                $scope.words = getWords();
            }
            document.querySelectorAll('.classroom input')[0].focus()
        };

        $scope.words = getWords();
        $scope.currentWord = $scope.words.shift();
        $scope.lastCheckCorrect = false;
        $scope.lastCheckIncorrect = false;
        $scope.showAnswerMode = false;

        $scope.check = function(){
            $scope.firstStatus = String($scope.verbs.first == $scope.currentWord[1]);
            $scope.secondStatus = $scope.verbs.second == $scope.currentWord[2] ? 'true' : 'false';
            $scope.thirdStatus = $scope.verbs.third == $scope.currentWord[3];

            if ($scope.firstStatus && $scope.secondStatus && $scope.thirdStatus) {
                $scope.lastCheckCorrect = true;
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

        $scope.$watchCollection('verbs', function(){
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
