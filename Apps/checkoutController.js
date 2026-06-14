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
        var returnUrl = "/Home/Checkout";
        localStorage.setItem("returnUrl", returnUrl);
        //console.log($scope.obj.checkoutForm);
        //console.log($scope.cartItems);
        //$timeout(function () {
        if (!$scope.obj.checkoutForm || $scope.obj.checkoutForm.$invalid) {
                $scope.errorMessage = "ফর্মের সবগুলো ঘর সঠিকভাবে পূরণ করুন।";
                return;
        }

        var orderInformation = {
            RecipientName: $scope.obj.checkoutForm.fullName,
            RecipientPhone: $scope.obj.checkoutForm.phone,
            ShippingAddress: $scope.obj.checkoutForm.ShippingAddress,
            PaymentMethod: $scope.obj.checkoutForm.PaymentMethod,
            ShippingCost: 50,
            TotalAmount: $scope.getTotalCartPrice(),
            GrandTotal: $scope.getTotalCartPrice() + $scope.shippingCharge
        }
        $scope.cartItemsWithTotal = $scope.cartItems.map(function (item) {
            return {
                ProductId: item.ProductId,
                quantity: item.quantity,
                Price: item.Price,
                TotalPrice: item.quantity * item.Price
                //GrandTotal: item.quantity * item.Price
                //TotalPrice: 5 * 10
            };
        });
            
        var Save = Service.saveData_Model_List(baseUrl + '/Home/OrderPlaced', orderInformation, $scope.cartItemsWithTotal);
        Save.then(function (msg) {
            if (msg.message == "0001") {
                sweetAlertService.showResponseMessage('You must login before placing an order.-0')
                    .then(function (result) {
                        if (result.isConfirmed) {
                            //window.location.href = baseUrl + "/Login/Login";
                            var storedReturnUrl = localStorage.getItem("returnUrl") || "/Home/Checkout";
                            window.location.href = baseUrl + "/Login/Login?returnUrl=" + encodeURIComponent(storedReturnUrl);
                        }

                    })
            } else {
                $scope.cartItems = [];
                sweetAlertService.showResponseMessage(msg)
            }
            debugger;
           
            //LoadGridData();
        })            
    };

    // ১. পরিমাণ বৃদ্ধি করা (+)
    $scope.increaseQuantity = function (item) {
        item.quantity = parseInt(item.quantity) + 1;
        $scope.saveCartState();
    };

    // ২. পরিমাণ কমানো (-)
    $scope.decreaseQuantity = function (item) {
        if (item.quantity > 1) {
            item.quantity = parseInt(item.quantity) - 1;
            $scope.saveCartState();
        }
    };

    // ৩. কার্ট থেকে প্রোডাক্ট সম্পূর্ণ বাদ দেওয়া
    $scope.removeItem = function (item) {
        if (confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি কার্ট থেকে বাদ দিতে চান?")) {
            var index = $scope.cartItems.indexOf(item);
            if (index > -1) {
                $scope.cartItems.splice(index, 1);
                $scope.saveCartState();

                if ($scope.cartItems.length === 0) {
                    $scope.errorMessage = "আপনার কার্ট খালি। চেকআউট করার জন্য পণ্য যোগ করুন।";
                }
            }
        }
    };

    // ৪. হেল্পার ফাংশন: localStorage এবং RootScope আপডেট রাখা
    $scope.saveCartState = function () {
        localStorage.setItem('cart', JSON.stringify($scope.cartItems));
        $rootScope.$broadcast('cartUpdated', $scope.cartItems);
    };


    // কন্ট্রোলার লোড হওয়ার সময় কার্ট লোড করুন
    $scope.loadCartItems();

}]);