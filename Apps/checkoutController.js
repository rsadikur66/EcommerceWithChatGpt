app.controller('checkoutController', ["$scope", "$rootScope", "Service", function ($scope, $rootScope, Service) {

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
                $scope.cartItems.forEach(function (item) {
                    if (!item.price) {
                        if (item.product_id === '301') item.price = 899.50;
                        else if (item.product_id === '300') item.price = 999.99;
                        else item.price = 0;
                    }
                });
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
            total += item.quantity * (item.price || 0);
        });
        return total;
    };

    // অর্ডার প্লেস করার ফাংশন
    $scope.placeOrder = function () {
        $scope.orderPlacedMessage = '';
        $scope.errorMessage = '';

        if ($scope.checkoutForm.$invalid) {
            $scope.errorMessage = "অনুগ্রহ করে ফর্মের সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন।";
            return;
        }

        var orderData = {
            customerInfo: $scope.order,
            orderItems: $scope.cartItems.map(function (item) {
                return {
                    productId: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                };
            }),
            totalAmount: $scope.getTotalCartPrice()
        };

        $http.post('/api/order/placeorder', orderData)
            .then(function (response) {
                $scope.orderPlacedMessage = 'আপনার অর্ডার সফলভাবে প্লেস করা হয়েছে! অর্ডার আইডি: ' + response.data.orderId;

                // অর্ডার সফল হওয়ার পর কার্ট খালি করুন এবং localStorage থেকে সরান
                localStorage.removeItem('cart'); // localStorage থেকে cart মুছে দিন
                $scope.cartItems = []; // ভিউ আপডেট করুন
                $scope.order = {}; // ফর্ম ডেটা খালি করুন

                $rootScope.$broadcast('cartUpdated'); // ব্যাজ আপডেট করার জন্য ইভেন্ট ব্রডকাস্ট করুন

                // ঐচ্ছিক: অর্ডার নিশ্চিতকরণ পেজে রিডাইরেক্ট করুন
                // $window.location.href = '/Shop/OrderConfirmation/' + response.data.orderId;

            })
            .catch(function (error) {
                console.error("অর্ডার প্লেস করতে সমস্যা হয়েছে:", error);
                $scope.errorMessage = "অর্ডার প্লেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
                if (error.data && error.data.message) {
                    $scope.errorMessage += " " + error.data.message;
                }
            });
    };

    // কন্ট্রোলার লোড হওয়ার সময় কার্ট লোড করুন
    $scope.loadCartItems();
   

   

    


}]);