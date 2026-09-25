app.controller('cartPageController', ["$scope", "$rootScope", "sweetAlertService", "Service", "baseUrlService", function ($scope, $rootScope, sweetAlertService, Service, baseUrlService) {

    var baseUrl = baseUrlService.getBaseUrl();

    $scope.cartItems = [];
    $scope.errorMessage = '';

    // Cart.cshtml এর ng-model গুলোর সাথে হুবহু মিলিয়ে ফর্ম অবজেক্ট
    $scope.obj = {
        checkoutForm: {
            CustomerName: '',
            CustomerMobile: '',
            Region: '',
            DeliveryAddress: '',
            PaymentMethod: 'COD',
            ShippingCharge: 0
        }
    };

    // 
    var savedForm = localStorage.getItem("pendingCheckoutForm");
    if (savedForm) {
        try {
            $scope.obj.checkoutForm = JSON.parse(savedForm);
            localStorage.removeItem("pendingCheckoutForm"); //
        } catch (e) {
            console.error("Error restoring saved checkout form:", e);
        }
    }

    // localStorage থেকে কার্ট আইটেম লোড করা
    $scope.loadCartItems = function () {
        var storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                $scope.cartItems = JSON.parse(storedCart);
            } catch (e) {
                console.error("Error parsing cart from localStorage:", e);
                $scope.cartItems = [];
            }
        } else {
            $scope.cartItems = [];
        }

        if ($scope.cartItems.length === 0) {
            $scope.errorMessage = "আপনার কার্ট খালি। অর্ডার করার জন্য পণ্য যোগ করুন।";
        }
    };

    // Region সিলেক্ট করলে শিপিং চার্জ আপডেট (Cart.cshtml এর ng-change এ কল হয়)
    $scope.updateShippingCharge = function () {
        if ($scope.obj.checkoutForm.Region === 'Inside Dhaka') {
            $scope.obj.checkoutForm.ShippingCharge = 60;
        } else if ($scope.obj.checkoutForm.Region === 'Outside Dhaka') {
            $scope.obj.checkoutForm.ShippingCharge = 120;
        } else {
            $scope.obj.checkoutForm.ShippingCharge = 0;
        }
    };

    // মোট কার্ট মূল্য
    $scope.getTotalCartPrice = function () {
        var total = 0;
        $scope.cartItems.forEach(function (item) {
            total += item.quantity * (item.Price || 0);
        });
        return total;
    };

    // পরিমাণ বৃদ্ধি
    $scope.increaseQuantity = function (item) {
        item.quantity = parseInt(item.quantity) + 1;
        $scope.saveCartState();
    };

    // পরিমাণ হ্রাস
    $scope.decreaseQuantity = function (item) {
        if (item.quantity > 1) {
            item.quantity = parseInt(item.quantity) - 1;
            $scope.saveCartState();
        }
    };

    // কার্ট থেকে আইটেম বাদ দেওয়া
    $scope.removeItem = function (item) {
        if (confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি কার্ট থেকে বাদ দিতে চান?")) {
            var index = $scope.cartItems.indexOf(item);
            if (index > -1) {
                $scope.cartItems.splice(index, 1);
                $scope.saveCartState();
                if ($scope.cartItems.length === 0) {
                    $scope.errorMessage = "আপনার কার্ট খালি। অর্ডার করার জন্য পণ্য যোগ করুন।";
                }
            }
        }
    };

    // localStorage + rootScope sync
    $scope.saveCartState = function () {
        localStorage.setItem('cart', JSON.stringify($scope.cartItems));
        $rootScope.$broadcast('cartUpdated', $scope.cartItems);
    };

    // মূল অর্ডার প্লেস করার ফাংশন
    $scope.placeOrder = function () {
        $scope.errorMessage = '';

        if ($scope.cartItems.length === 0) {
            $scope.errorMessage = "আপনার কার্ট খালি।";
            return;
        }

        var f = $scope.obj.checkoutForm;
        if (!f.CustomerName || !f.CustomerMobile || !f.Region || !f.DeliveryAddress) {
            sweetAlertService.showWarning('অসম্পূর্ণ তথ্য!', 'অনুগ্রহ করে নাম, মোবাইল, এলাকা ও ঠিকানা সঠিকভাবে পূরণ করুন।');
            return;
        }

        // login লাগলে যাতে ফেরত এসে আবার Cart page এই থাকে
        localStorage.setItem("returnUrl", "/Home/Cart");

        var orderInformation = {
            RecipientName: f.CustomerName,
            RecipientPhone: f.CustomerMobile,
            ShippingAddress: f.Region + ' - ' + f.DeliveryAddress,
            PaymentMethod: f.PaymentMethod,
            ShippingCost: f.ShippingCharge || 0,
            TotalAmount: $scope.getTotalCartPrice(),
            GrandTotal: $scope.getTotalCartPrice() + (f.ShippingCharge || 0)
        };

        var cartItemsWithTotal = $scope.cartItems.map(function (item) {
            return {
                ProductID: item.ProductId,
                Quantity: item.quantity,
                UnitPrice: item.Price,
                TotalPrice: item.quantity * item.Price
            };
        });

        var save = Service.saveData_Model_List(baseUrl + '/Home/OrderPlaced', orderInformation, cartItemsWithTotal);

        save.then(function (response) {

            // লগইন করা নেই
            if (response && response.message === "0001") {
                // ফর্মের ডেটা সেভ করে রাখা হচ্ছে, যাতে লগইন করে ফেরত আসার পর হারিয়ে না যায়
                localStorage.setItem("pendingCheckoutForm", JSON.stringify($scope.obj.checkoutForm));

                sweetAlertService.showResponseMessage('অর্ডার সম্পন্ন করতে আগে লগইন করুন।-0')
                    .then(function (result) {
                        var storedReturnUrl = localStorage.getItem("returnUrl") || "/Home/Cart";
                        window.location.href = baseUrl + "/Login/Login?returnUrl=" + encodeURIComponent(storedReturnUrl);
                    });
                return;
            }

            // সফল অর্ডার
            if (response && response.success) {
                localStorage.removeItem('cart');
                localStorage.removeItem('pendingCheckoutForm'); // সফল হলে সেভ করা ফর্ম ডেটাও মুছে ফেলা
                $rootScope.$broadcast('cartUpdated');
                $scope.cartItems = [];

                Swal.fire({
                    icon: 'success',
                    title: 'অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!',
                    text: 'আপনার অর্ডার ট্র্যাকিং আইডি: ' + response.orderId,
                    showCancelButton: true,
                    confirmButtonColor: '#198754',
                    cancelButtonColor: '#0d6efd',
                    confirmButtonText: 'হোমপেজে যান',
                    cancelButtonText: '<i class="bi bi-file-earmark-pdf"></i> রসিদ ডাউনলোড করুন'
                }).then(function (result) {
                    if (result.isConfirmed) {
                        window.location.href = baseUrl + '/Home/Index';
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        window.open(baseUrl + '/Home/InvoiceReport?orderId=' + response.orderId, '_blank');
                        window.location.href = baseUrl + '/Home/Index';
                    }
                });
            } else {
                // ব্যর্থ অর্ডার
                sweetAlertService.showError('এরর!', (response && response.message) || 'অর্ডার প্রসেস করতে সমস্যা হয়েছে।');
            }
        }, function (error) {
            sweetAlertService.showError('এরর!', 'সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে।');
        });
    };

    $scope.loadCartItems();

}]);