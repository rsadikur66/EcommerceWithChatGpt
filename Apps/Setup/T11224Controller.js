app.controller('T11224Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "LoaderService","baseUrlService", function ($scope, $rootScope, Service, Data, sweetAlertService, LoaderService, baseUrlService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11224 = {};
    var baseUrl = baseUrlService.getBaseUrl();
    $scope.pageSize = 5;
    LoadCategories();
    //LoadGridData();
    //$scope.FormCode = "T11223";
    //$scope.FormName = "Add Product Setup Page";
    $scope.selectedCategory = null;
    //loadSubcategories();

    //function LoadGridData() {
    //    LoaderService.show();
    //    Service.loadDataWithoutParm(baseUrl + '/T11222/GetSubCatList')
    //        .then(function (returnData) {
    //            $scope.obj.subCategories = JSON.parse(returnData);
    //        });
    //    LoaderService.hide();
    //}
    $scope.imagePreviewUrl = null;

   
    function LoadCategories() {
        LoaderService.show();
        Service.loadDataWithoutParm(baseUrl + '/T11224/GetAllProductsData')
            .then(function (returnData) {
                $scope.obj.productList = JSON.parse(returnData);
            });
        LoaderService.hide();
    }

    $scope.selectSubCategory = function (data) {
        $scope.obj.T11222.SubCategoryId = data.SubCategoryId;
        $scope.obj.ddlItemCategories = { Name: data.Name, CategoryId: data.CategoryId };
        $scope.obj.T11222.CategoryId = $scope.obj.ddlItemCategories.CategoryId;
        $scope.obj.T11222.Name = data.Name;
        $scope.obj.T11222.Description = data.Description;
        $scope.selectedSubCategory = data.CategoryId;
        //$scope.buttonText = "Update";
        //$('#myCategoryModal').modal('toggle');
        $('#myCategoryModal').modal('show');
        /* $("#myCategoryModal").modal();*/
    };


    $scope.btnClearClick = function () {
        $scope.obj.T11222 = {};
    }
}]);


