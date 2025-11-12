app.controller('ProductDetailsController', ["$scope", "$rootScope", "Service", "baseUrlService", function ($scope, $rootScope, Service, baseUrlService) {
    //var baseUrl = window.location.origin + window.location.pathname;
    var baseUrl = baseUrlService.getBaseUrl();
    function getQueryParam(param) {
        var params = new URLSearchParams(window.location.search);
        return params.get(param);
    }
    var Id = getQueryParam("id");
    //console.log(Id);
    if (Id != null || Id != undefined) {
        debugger;
        loadProductsDetailsById(Id)
    }
    
    $scope.cartItems = [];
    // **গুরুত্বপূর্ণ:** কন্ট্রোলার লোড হওয়ার সাথে সাথে localStorage থেকে কার্ট লোড করুন
    var storedCart = localStorage.getItem('cart');
    if (storedCart) {
        try {
            $scope.cartItems = JSON.parse(storedCart);
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            $scope.cartItems = []; // পার্স করতে সমস্যা হলে খালি সেট করুন
        }
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
        var load = Service.loadDataSingleParm(baseUrl+'/Home/ProductsDetailsByIdData', productId);
        load.then(function (returnData) {
            var dataArray = JSON.parse(returnData);
            for (let i = 0; i < dataArray.length; i++) {
                dataArray[i].buttonText = "Add to cart";
                dataArray[i].ImageUrl = baseUrl + dataArray[i].ImageUrl;
            }
            $scope.selectedProduct = dataArray[0];


            //loadCategoryData();
        });
        //loadCategoryData();
    }


    $scope.addToCart = function (product) {
        debugger;
        var found = false;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            if ($scope.cartItems[i].ProductId === product.ProductId) {
                $scope.cartItems[i].quantity++;
                found = true;
                break;
            }
        }
        if (!found) {
            // কার্টে না থাকলে, 1 এর পরিমাণ সহ এটি যোগ করুন
            $scope.cartItems.push(angular.extend({ quantity: 1 }, product));
        }
        
        localStorage.setItem('cart', JSON.stringify($scope.cartItems));
        // **গুরুত্বপূর্ণ:** এখানে একটি ইভেন্ট ব্রডকাস্ট করুন
        $rootScope.$broadcast('cartUpdated'); // 'cartUpdated' নামে একটি ইভেন্ট ব্রডকাস্ট করা হলো
        // ঐচ্ছিক: ব্যবহারকারীকে প্রতিক্রিয়া দিন (যেমন, একটি ছোট সফলতার বার্তা)
        alert(product.ProductName + " কার্টে যোগ করা হয়েছে! কার্ট সংখ্যা: " + $scope.cartItems.length);
    };   

    //LoadCategories();


 




    

    

}]);