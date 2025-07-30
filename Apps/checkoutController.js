app.controller('checkoutController', ["$scope", "$rootScope", "Data", "Service", function ($scope, $rootScope,Data, Service) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.checkout = {};
    $scope.cartItems = [];
    $scope.order = {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'COD'
    };
    $scope.orderPlacedMessage = '';
    $scope.errorMessage = '';

    // localStorage থেকে কার্ট আইটেম লোড করুন
    $scope.loadCartItems = function () {
        var storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                $scope.cartItems = JSON.parse(storedCart);
                //$scope.cartItems.forEach(function (item) {
                //    if (!item.price) {
                //        if (item.product_id === '301') item.Price = 899.50;
                //        else if (item.product_id === '300') item.Price = 999.99;
                //        else item.price = 0;
                //    }
                //});
            } catch (e) {
                console.error("Error parsing cart from localStorage in checkoutController:", e);
                $scope.cartItems = [];
            }
        } else {
            $scope.cartItems = [];
        }
        if ($scope.cartItems.length === 0) {
            $scope.errorMessage = "আপনার কার্ট খালি। চেকআউট করার জন্য পণ্য যোগ করুন।";
        }
    };

    // মোট কার্ট মূল্য গণনা
    $scope.getTotalCartPrice = function () {
        var total = 0;
        $scope.cartItems.forEach(function (item) {
            total += item.quantity * (item.Price || 0);
        });
        return total;
    };

    // অর্ডার প্লেস করার ফাংশন
    $scope.placeOrder = function () {
        $scope.orderPlacedMessage = '';
        $scope.errorMessage = '';

        console.log($scope.checkoutForm);
        //$timeout(function () {
            if (!$scope.checkoutForm || $scope.checkoutForm.$invalid) {
                $scope.errorMessage = "ফর্মের সবগুলো ঘর সঠিকভাবে পূরণ করুন।";
                return;
            }

            var orderData = {
                customerInfo: $scope.order,
                orderItems: $scope.cartItems.map(function (item) {
                    return {
                        productId: item.ProductId,
                        quantity: item.quantity,
                        price: item.Price
                    };
                }),
                totalAmount: $scope.getTotalCartPrice()
            };

            console.log(orderData);
            //$http.post('/api/order/placeorder', orderData)
            //    .then(function (response) {
            //        $scope.orderPlacedMessage = 'আপনার অর্ডার সফলভাবে প্লেস করা হয়েছে! অর্ডার আইডি: ' + response.data.orderId;

            //        localStorage.removeItem('cart');
            //        $scope.cartItems = [];
            //        $scope.order = {};

            //        $rootScope.$broadcast('cartUpdated');

            //        // ঐচ্ছিক: অর্ডার নিশ্চিতকরণ পেজে রিডাইরেক্ট করুন
            //        // $window.location.href = '/Shop/OrderConfirmation/' + response.data.orderId;

            //    })
            //    .catch(function (error) {
            //        console.error("অর্ডার প্লেস করতে সমস্যা হয়েছে:", error);
            //        $scope.errorMessage = "অর্ডার প্লেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
            //        if (error.data && error.data.message) {
            //            $scope.errorMessage += " " + error.data.message;
            //        }
            //    });
        //}); // 🔴 এটা আগে ছিল না, এখন ঠিক করা হয়েছে
    };


    // কন্ট্রোলার লোড হওয়ার সময় কার্ট লোড করুন
    $scope.loadCartItems();

}]);