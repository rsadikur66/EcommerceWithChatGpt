app.controller('T11221Controller', ["$scope", "$rootScope", "Service", "Data", function ($scope, $rootScope, Service, Data) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11221 = {};

    LoadCategories();
    $scope.FormCode = "T11221";
    $scope.FormName = "Category Setup Page"
    $scope.cartItems = [];


    function LoadCategories() {
        Service.loadDataWithoutParm('/T11221/GetCatList')
            .then(function (returnData) {
                $scope.obj.categories = JSON.parse(returnData);
                console.log(JSON.parse(returnData));
                //cat.subLoaded = true;
            });
    }
    $scope.loadCart = function () {
        debugger;
        // ... আপনার loadCart লজিক ...
        var storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                $scope.cartItems = JSON.parse(storedCart);
                // নিশ্চিত করুন যে আপনার price ডেটা আছে বা এখানে লোড করছেন
                //$scope.cartItems.forEach(function (item) {
                //    if (!item.price) {
                //        if (item.product_id === '301') item.price = 899.50;
                //        else if (item.product_id === '300') item.price = 999.99;
                //        else item.price = 0;
                //    }
                //});
            } catch (e) {
                console.error("Error parsing cart from localStorage:", e);
                $scope.cartItems = [];
            }
        }
        $rootScope.$broadcast('cartUpdated'); // লোড হওয়ার পরেও ব্রডকাস্ট করুন
    };

    $scope.updateCartItem = function (item) {
        // ... আপনার updateCartItem লজিক ...
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        localStorage.setItem('cart', JSON.stringify($scope.cartItems));
        $rootScope.$broadcast('cartUpdated'); // আপডেটের পর ব্রডকাস্ট করুন
    };

    $scope.removeFromCart = function (itemToRemove) {
        // ... আপনার removeFromCart লজিক ...
        $scope.cartItems = $scope.cartItems.filter(function (item) {
            return item.product_id !== itemToRemove.product_id;
        });
        localStorage.setItem('cart', JSON.stringify($scope.cartItems));
        $rootScope.$broadcast('cartUpdated'); // সরানোর পর ব্রডকাস্ট করুন
    };

    //$scope.getTotalCartPrice = function () {
    //    // ... আপনার getTotalCartPrice লজিক ...
    //};
    $scope.getTotalCartPrice = function () {
        var total = 0;
        $scope.cartItems.forEach(function (item) {
            total += item.quantity * (item.price || 0);
        });
        return total;
    };

    $scope.loadCart(); // কন্ট্রোলার লোড হওয়ার সময় কার্ট লোড করুন


}]);