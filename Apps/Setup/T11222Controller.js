app.controller('T11222Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", function ($scope, $rootScope, Service, Data,sweetAlertService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11222 = {};
    var baseUrl = window.location.origin;
    $scope.pageSize = 5;
    LoadCategories();
    LoadGridData();
    $scope.FormCode = "T11222";
    $scope.FormName = "Sub Category Setup Page";
    $scope.selectedCategory = null;
    

    function LoadGridData() {
        Service.loadDataWithoutParm(baseUrl +'/T11222/GetSubCatList')
            .then(function (returnData) {
                $scope.obj.subCategories = JSON.parse(returnData);
            });
    }

    function LoadCategories() {
        Service.loadDataWithoutParm(baseUrl + '/T11221/GetCatList')
            .then(function (returnData) {
                $scope.obj.categories = JSON.parse(returnData);
                console.log($scope.obj.categories);
                //cat.subLoaded = true;
            });
    }

    $scope.btnSaveClick = function () {

        if ($scope.obj.T11221.Name == "" || $scope.obj.T11221.Name == undefined) {
            sweetAlertService.showError("Required!!!", "Please input required field.");
            return;
        }
        //var file = document.getElementById('uploadFile').files[0];
        //var formdata = new FormData();
        //formdata.append('CATEGORY_ID', $scope.obj.cat.CATEGORY_ID);
        //formdata.append('T_LANG2_NAME', $scope.obj.cat.T_LANG2_NAME);
        ////...
        //formdata.append('ICON', file);
        console.log($scope.obj.T11221);
        var save = Service.saveData(baseUrl +'/T11222/SaveData', $scope.obj.T11221);
        save.then(function (msg) {
            debugger;
            sweetAlertService.showResponseMessage(msg);
            LoadCategories();
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