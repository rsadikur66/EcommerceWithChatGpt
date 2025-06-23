app.controller('HomepageController', ["$scope", "Service", function ($scope, Service) {
    //function getQueryParam(param) {
    //    var params = new URLSearchParams(window.location.search);
    //    return params.get(param);
    //}
    //var Id = getQueryParam("id");
    //console.log(Id);
    //if (Id != null || Id != undefined) {
    //    loadProductsDetailsById(Id)
    //}

    LoadAllHomeProducts();
    function LoadAllHomeProducts() {
        Service.loadDataWithoutParm('/Home/LoadAllHomeProducts')
            .then(function (returnData) {
                $scope.products = JSON.parse(returnData);
                console.log($scope.products);
                
            });
    }

  














}]);