app.controller('T11221Controller', ["$scope", "$rootScope", "Service", "Data", function ($scope, $rootScope, Service, Data) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11221 = {};
    var baseUrl = window.location.origin;
    $scope.pageSize = 5;
    LoadCategories();
    $scope.FormCode = "T11221";
    $scope.FormName = "Category Setup Page";
    $scope.selectedCategory = null;


    function LoadCategories() {
        Service.loadDataWithoutParm(baseUrl +'/T11221/GetCatList')
            .then(function (returnData) {
                $scope.obj.categories = JSON.parse(returnData);
                console.log($scope.obj.categories);
                //cat.subLoaded = true;
            });
    }

    $scope.Save = function () {
        //var file = document.getElementById('uploadFile').files[0];
        //var formdata = new FormData();
        //formdata.append('CATEGORY_ID', $scope.obj.cat.CATEGORY_ID);
        //formdata.append('T_LANG2_NAME', $scope.obj.cat.T_LANG2_NAME);
        ////...
        //formdata.append('ICON', file);
        console.log($scope.obj.T11221);
        var save = Service.saveData(baseUrl +'/T11221/SaveData', $scope.obj.T11221);
        save.then(function (success) {
            alert(success);
            loadGridData();
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

    $scope.selectCategory = function (data) {
        $scope.obj.T11221.CategoryId = data.CategoryId;
        $scope.obj.T11221.Name = data.Name;
        $scope.obj.T11221.Description = data.Description;
        $scope.selectedCategory = data.CategoryId;
        //$scope.buttonText = "Update";
        //$('#myCategoryModal').modal('toggle');
        $('#myCategoryModal').modal('show');
        /* $("#myCategoryModal").modal();*/
    };
   


}]);