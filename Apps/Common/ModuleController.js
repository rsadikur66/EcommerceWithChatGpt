app.controller('ModuleController', ["$scope", "$rootScope", "Service", "Data", function ($scope, $rootScope, Service,Data) {

    $scope.obj = {};
    $scope.obj = Data;
    $scope.modules = [];
    $scope.moduleName = 'Products';
    LoadModules();
    function LoadModules() {
        Service.loadDataWithoutParm('/Home/LoadModules')
            .then(function (returnData) {
                var data = JSON.parse(returnData);  
                $scope.obj.setupList = data.filter(x => x.T_LINK_SEPARATION === "1");
                $scope.obj.setupLength = $scope.obj.setupList.length;
                $scope.obj.transList = data.filter(x => x.T_LINK_SEPARATION === "2");
                $scope.obj.transLength = $scope.obj.transList.length;
                $scope.obj.reportList = data.filter(x => x.T_LINK_SEPARATION === "3");
                $scope.obj.reportLength = $scope.obj.reportList.length;
            });
    }


    $scope.PageRedirect_Clic = function (link) {
        //loader(true)
        window.location.href = link;
        //window.location = link;
        //  $location.path(link);

    };

}]);