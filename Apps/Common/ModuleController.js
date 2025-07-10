app.controller('ModuleController', ["$scope", "$rootScope", "Service", function ($scope, $rootScope, Service) {
    $scope.modules = [];
    $scope.moduleName = 'Products';
    LoadModules();
    function LoadModules() {
        Service.loadDataWithoutParm('/Home/LoadModules')
            .then(function (returnData) {
                $scope.modules = JSON.parse(returnData);               
            });
    }

}]);