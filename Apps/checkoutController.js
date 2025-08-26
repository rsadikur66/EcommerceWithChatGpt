app.controller('checkoutController', ["$scope", "$rootScope", "Data", "Service", "baseUrlService", function ($scope, $rootScope, Data, Service, baseUrlService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.checkout = {};
    $scope.cartItems = [];
    var baseUrl = baseUrlService.getBaseUrl();
    //$scope.order = {
    //    fullName: '',
    //    phone: '',
    //    address: '',
    //    city: '',
    //    zipCode: '',
    //    paymentMethod: 'COD'
    //};
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

        console.log($scope.obj.checkoutForm);
        console.log($scope.cartItems);
        //$timeout(function () {
        if (!$scope.obj.checkoutForm || $scope.obj.checkoutForm.$invalid) {
                $scope.errorMessage = "ফর্মের সবগুলো ঘর সঠিকভাবে পূরণ করুন।";
                return;
            }

            var orderData = {
                customerInfo: $scope.obj.checkoutForm,
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
        /*saveData_Model_List*/
        var Save = Service.saveData(baseUrl + '/Home/OrderPlaced', orderData);
        Save.then(function (msg) {
            if (msg == "0001") {
                sweetAlertService.showResponseMessage('You must login before placing an order.');
            }
            debugger;
           
            //LoadGridData();
        })            
    };


    // কন্ট্রোলার লোড হওয়ার সময় কার্ট লোড করুন
    $scope.loadCartItems();

}]);