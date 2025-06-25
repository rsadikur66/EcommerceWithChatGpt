app.controller('ProductDetailsController', ["$scope", "Service", function ($scope, Service) {
    function getQueryParam(param) {
        var params = new URLSearchParams(window.location.search);
        return params.get(param);
    }
    var Id = getQueryParam("id");
    console.log(Id);
    if (Id != null || Id != undefined) {
        loadProductsDetailsById(Id)
    }
    

    //function LoadCategories() {
    //    Service.loadDataSingleParm('/Home/ProductDetailsById', Id)
    //        .then(function (returnData) {
    //            $scope. = JSON.parse(returnData);
    //            //cat.subLoaded = true;
    //        });
    //}
    function loadProductsDetailsById(productId) {
        /*  loader(true)*/
        var load = Service.loadDataSingleParm('/Home/ProductsDetailsByIdData', productId);
        load.then(function (returnData) {
            var dataArray = JSON.parse(returnData);
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i].buttonText = "Add to cart";
            }
            $scope.selectedProduct = dataArray[0];


            //loadCategoryData();
        });
        //loadCategoryData();
    }
   

    //LoadCategories();


 




    

    

}]);