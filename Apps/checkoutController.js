app.controller('checkoutController', ["$scope", "$rootScope", "Data", "sweetAlertService", "Service", "baseUrlService", function ($scope, $rootScope, Data,sweetAlertService, Service, baseUrlService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.checkout = {};
    $scope.cartItems = [];
    $scope.shippingCharge = 100;
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

        //console.log($scope.obj.checkoutForm);
        //console.log($scope.cartItems);
        //$timeout(function () {
        if (!$scope.obj.checkoutForm || $scope.obj.checkoutForm.$invalid) {
                $scope.errorMessage = "ফর্মের সবগুলো ঘর সঠিকভাবে পূরণ করুন।";
                return;
        }

        var orderInformation = {
            ShippingAddress: $scope.obj.checkoutForm.ShippingAddress,
            PaymentMethod: $scope.obj.checkoutForm.PaymentMethod,
            ShippingCost: 50,
            TotalAmount: $scope.getTotalCartPrice()
        }
        $scope.cartItemsWithTotal = $scope.cartItems.map(function (item) {
            return {
                ProductId: item.ProductId,
                quantity: item.quantity,
                Price: item.Price,
                TotalPrice: item.quantity * item.Price
                //TotalPrice: 5 * 10
            };
        });
            //var orderData = {
            //    customerInfo: {
            //        CustomerID: 101,
            //        ShippingAddress: $scope.obj.checkoutForm.ShippingAddress,
            //        BillingAddress: "Karwan Bazar",
            //        PaymentMethod: $scope.obj.checkoutForm.PaymentMethod,
            //        TotalAmount: $scope.getTotalCartPrice()
            //    },
            //    orderItems: $scope.cartItems.map(function (item) {
            //        return {
            //            ProductID: item.ProductId,
            //            Quantity: item.quantity,
            //            UnitPrice: item.Price,
            //            TotalPrice: item.quantity * item.Price
            //        };
            //    }),
            //    //totalAmount: $scope.getTotalCartPrice()
            //};

        //console.log(orderData);
        /*saveData_Model_List*/
        //var Save = Service.saveData(baseUrl + '/Home/OrderPlaced', orderData);
        var Save = Service.saveData_Model_List(baseUrl + '/Home/OrderPlaced', orderInformation, $scope.cartItems);
        Save.then(function (msg) {
            if (msg.message == "0001") {
                sweetAlertService.showResponseMessage('You must login before placing an order.-0')
                    .then(function (result) {
                        if (result.isConfirmed) {
                            window.location.href = baseUrl + "/Login/Login";
                        }
                    })
            }
            debugger;
           
            //LoadGridData();
        })            
    };


    // কন্ট্রোলার লোড হওয়ার সময় কার্ট লোড করুন
    $scope.loadCartItems();

}]);