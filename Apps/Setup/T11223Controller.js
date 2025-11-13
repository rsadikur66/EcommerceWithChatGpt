app.controller('T11223Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "LoaderService","baseUrlService", function ($scope, $rootScope, Service, Data, sweetAlertService, LoaderService, baseUrlService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11223 = {};
    // Initialize CKEditor
    setTimeout(function () {
        CKEDITOR.replace('description');
    }, 100);
    var baseUrl = baseUrlService.getBaseUrl();
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
    $scope.imagePreviewUrl = null;

    $scope.previewImage = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.imagePreviewUrl = e.target.result;
                });
            };
            reader.readAsDataURL(input.files[0]);
        }
    };
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
        Service.loadDataSingleParm(baseUrl + '/T11223/GetSubCatList', categoryId)
            .then(function (returnData) {
                $scope.obj.subCategories = JSON.parse(returnData);
            });
        LoaderService.hide();
        
    };

    $scope.saveProduct = function () {
        // ✅ Validation
        if (!$scope.obj.T11223.name) {
            sweetAlertService.showError("প্রয়োজনীয়!", "দয়া করে প্রোডাক্ট নাম লিখুন।");
            return;
        }
        if (!$scope.obj.ddlItemCategories || !$scope.obj.ddlItemCategories.CategoryId) {
            sweetAlertService.showError("প্রয়োজনীয়!", "দয়া করে ক্যাটাগরি সিলেক্ট করুন।");
            return;
        }
        if (!$scope.obj.ddlItemSubCategories || !$scope.obj.ddlItemSubCategories.SubCategoryId) {
            sweetAlertService.showError("প্রয়োজনীয়!", "দয়া করে সাব-ক্যাটাগরি সিলেক্ট করুন।");
            return;
        }
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].updateElement();
        }

        var descriptionData = "";
        if (CKEDITOR.instances['description']) {
            $scope.obj.T11223.description = CKEDITOR.instances['description'].getData();
        }

        // ✅ FormData তৈরি
        var formData = new FormData();
        formData.append("Name", $scope.obj.T11223.name);
        formData.append("CategoryId", $scope.obj.ddlItemCategories.CategoryId);
        formData.append("SubCategoryId", $scope.obj.ddlItemSubCategories.SubCategoryId);
        formData.append("Price", $scope.obj.T11223.price);
        formData.append("Description", encodeURIComponent($scope.obj.T11223.description || ""));

        if ($scope.product && $scope.product.imageFile) {
            formData.append("ImageFile", $scope.product.imageFile);
        }

        LoaderService.show();

        // ✅ Image সহ Data সেভ
        Service.saveDataWithFile(baseUrl + '/T11223/SaveProduct', formData)
            .then(function (response) {
                LoaderService.hide();

                if (response == "success") {
                    sweetAlertService.showSuccess("সফল", "প্রোডাক্ট সফলভাবে সংরক্ষণ হয়েছে!");

                    // ফর্ম ক্লিয়ার
                    clear();
                } else {
                    sweetAlertService.showError("ব্যর্থ", "সেভ করা সম্ভব হয়নি!");
                }
            })
            .catch(function (error) {
                LoaderService.hide();
                sweetAlertService.showError("ত্রুটি", "সার্ভারে সমস্যা হয়েছে!");
                console.error(error);
            });
    };



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

    function clear() {
        $scope.obj.T11223 = {};
        $scope.imagePreviewUrl = null;
        $scope.obj.ddlItemCategories = null;
        $scope.obj.ddlItemSubCategories = null;
        $scope.product.imageFile = null;
    }
    $scope.btnClearClick = function () {
        clear();
    }
}]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
