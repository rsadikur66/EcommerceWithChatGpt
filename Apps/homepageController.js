app.controller('HomepageController', ["$scope", "$rootScope", "Service", "baseUrlService", function ($scope, $rootScope, Service, baseUrlService) {
    //function getQueryParam(param) {
    //    var params = new URLSearchParams(window.location.search);
    //    return params.get(param);
    //}
    //var Id = getQueryParam("id");
    //console.log(Id);
    //if (Id != null || Id != undefined) {
    //    loadProductsDetailsById(Id)
    //}    
    var baseUrl = baseUrlService.getBaseUrl();
   $rootScope.$on("productSearch", function (event, searchText) {
    if (!searchText || searchText.trim() === "") {
        // কোনো search text না থাকলে সব product দেখাও
        $scope.filteredProducts = angular.copy($scope.products);
    } else {
        var lowerText = searchText.toLowerCase();
        $scope.filteredProducts = $scope.products.filter(function(p) {
            return p.ProductName.toLowerCase().includes(lowerText);
        });
    }
});


//function searchProducts(text) {
  //  Service.loadDataSingleParm(baseUrl + '/Home/SearchProduct',text)
    //    .then(function (returnData) {
      //  $scope.products = JSON.parse(returnData);
//
  //      for (let i = 0; i < $scope.products.length; i++) {
    //        $scope.products[i].buttonText = "Add to cart";
      //      $scope.products[i].ImageUrl = baseUrl + $scope.products[i].ImageUrl;
        //}
    //});
//}

    $scope.cartItems = []; // কার্ট আইটেমগুলি রাখার জন্য একটি খালি অ্যারে শুরু করুন
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
    LoadAllHomeProducts();
    function LoadAllHomeProducts() {
        Service.loadDataWithoutParm(baseUrl + '/Home/LoadAllHomeProducts')
            .then(function (returnData) {
                $scope.products = JSON.parse(returnData);
                for (let i = 0; i < $scope.products.length; i++) {
                    $scope.products[i].buttonText = "Add to cart";
                    $scope.products[i].ImageUrl = baseUrl + $scope.products[i].ImageUrl;
                    console.log($scope.products[i].ImageUrl);
                }
                console.log($scope.products);
            });
    }

    // কার্টে একটি পণ্য যোগ করার ফাংশন
    $scope.addToCart = function (product) {
        debugger;
        // পণ্যটি ইতিমধ্যেই কার্টে আছে কিনা তা পরীক্ষা করুন
        var found = false;
        for (var i = 0; i < $scope.cartItems.length; i++) {
            if ($scope.cartItems[i].ProductId === product.ProductId) {
                $scope.cartItems[i].Price = product.Price;
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
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            background: '#FAC332',
            title: product.ProductName + " কার্টে যোগ করা হয়েছে! কার্ট সংখ্যা: " + $scope.cartItems.length,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        //alert(product.ProductName + " কার্টে যোগ করা হয়েছে! কার্ট সংখ্যা: " + $scope.cartItems.length);
    };

  














}]);