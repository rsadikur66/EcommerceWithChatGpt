app.controller('ProductDetailsController', ["$scope", "$rootScope", "Service", function ($scope,$rootScope, Service) {
    function getQueryParam(param) {
        var params = new URLSearchParams(window.location.search);
        return params.get(param);
    }
    var Id = getQueryParam("id");
    console.log(Id);
    if (Id != null || Id != undefined) {
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


    $scope.addToCart = function (product) {
        debugger;
        // পণ্যটি ইতিমধ্যেই কার্টে আছে কিনা তা পরীক্ষা করুন
        var found = false;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            if ($scope.cartItems[i].product_id === product.product_id) {
                $scope.cartItems[i].quantity++; // কার্টে থাকলে পরিমাণ বৃদ্ধি করুন
                found = true;
                break;
            }
        }

        if (!found) {
            // কার্টে না থাকলে, 1 এর পরিমাণ সহ এটি যোগ করুন
            $scope.cartItems.push(angular.extend({ quantity: 1 }, product));
        }

        // একটি বাস্তব অ্যাপ্লিকেশনে, আপনি হয়তো চাইবেন:
        // 1. আপনার সার্ভারে আপডেট করা কার্ট ডেটা পাঠান $http.post ব্যবহার করে
        // 2. সেশন জুড়ে স্থায়িত্বের জন্য localStorage-এ কার্ট সংরক্ষণ করুন
        // localStorage এর উদাহরণ:
        localStorage.setItem('cart', JSON.stringify($scope.cartItems));
        // **গুরুত্বপূর্ণ:** এখানে একটি ইভেন্ট ব্রডকাস্ট করুন
        $rootScope.$broadcast('cartUpdated'); // 'cartUpdated' নামে একটি ইভেন্ট ব্রডকাস্ট করা হলো
        // ঐচ্ছিক: ব্যবহারকারীকে প্রতিক্রিয়া দিন (যেমন, একটি ছোট সফলতার বার্তা)
        alert(product.product_name + " কার্টে যোগ করা হয়েছে! কার্ট সংখ্যা: " + $scope.cartItems.length);
    };
   

    //LoadCategories();


 




    

    

}]);