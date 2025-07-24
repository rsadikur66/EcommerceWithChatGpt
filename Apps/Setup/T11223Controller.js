app.controller('T11223Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "LoaderService", function ($scope, $rootScope, Service, Data, sweetAlertService, LoaderService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11223 = {};
    var baseUrl = window.location.origin;
    $scope.pageSize = 5;
    LoadCategories();
    //LoadGridData();
    $scope.FormCode = "T11223";
    $scope.FormName = "Add Product Setup Page";
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

    function LoadCategories() {
        LoaderService.show();
        Service.loadDataWithoutParm(baseUrl + '/T11221/GetCatList')
            .then(function (returnData) {
                $scope.obj.categories = JSON.parse(returnData);
            });
        LoaderService.hide();
    }
    $scope.loadSubcategories = function () {
        var categoryId = $scope.obj.ddlItemCategories.CategoryId;
        LoaderService.show();
        Service.loadDataSingleParm(baseUrl + '/T11223/GetSubCatList')
            .then(function (returnData) {
                $scope.obj.categories = JSON.parse(returnData);
            });
        LoaderService.hide();
        
    };
    $scope.btnSaveClick = function () {

        if ($scope.obj.T11222.Name == "" || $scope.obj.T11222.Name == undefined) {
            sweetAlertService.showError("Required!!!", "Please input required Sub Category field.");
            return;
        }
        if (!$scope.obj.ddlItemCategories || !$scope.obj.ddlItemCategories.CategoryId) {
            sweetAlertService.showError("Required!!!", "Please select required category field.");
            return; // validation failed
        }
        //var file = document.getElementById('uploadFile').files[0];
        //var formdata = new FormData();
        //formdata.append('CATEGORY_ID', $scope.obj.cat.CATEGORY_ID);
        //formdata.append('T_LANG2_NAME', $scope.obj.cat.T_LANG2_NAME);
        ////...
        //formdata.append('ICON', file);
        $scope.obj.T11222.CategoryId = $scope.obj.ddlItemCategories.CategoryId;
        console.log($scope.obj.T11222);
        var save = Service.saveData(baseUrl + '/T11222/SaveData', $scope.obj.T11222);
        save.then(function (msg) {
            debugger;
            sweetAlertService.showResponseMessage(msg);
            LoadGridData();
        })


        //var insert = Service.saveData($scope.obj.T11221);
        //insert.then(function (data) {
        //    if (data) {
        //        alert("Data Save Successfully.")
        //    } else {
        //        alert("Data not Saved. Try Again.")
        //    }
        //    //var msg = data;
        //    //alert(msg);
        //    getCategoriesData();
        //    clear();
        //});
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