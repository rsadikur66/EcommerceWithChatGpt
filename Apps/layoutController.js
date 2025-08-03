app.controller('LayoutController', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "baseUrlService", function ($scope, $rootScope, Service, Data, sweetAlertService, baseUrlService) {
    console.log("LayoutController initialized");
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11999 = {};
    var baseUrl = baseUrlService.getBaseUrl();
    $scope.sidebarVisible = false;
    $scope.hoveredCategory = null;
    $scope.activeCategory = null; // New variable to track active category for styling
    $scope.categories = [];   // Category লোড হওয়ার পর ভরবে

    // লোডার স্ট্যাটাস ট্র্যাকিং এর জন্য নতুন প্রপার্টি
    $scope.isLoading = false;

    // loader_show ইভেন্ট শুনুন
    $rootScope.$on('loader_show', function () {
        $scope.isLoading = true;
    });

    // loader_hide ইভেন্ট শুনুন
    $rootScope.$on('loader_hide', function () {
        $scope.isLoading = false;
    });

    //function getQueryParam(param) {
    //    var params = new URLSearchParams(window.location.search);
    //    return params.get(param);
    //}
    //var Id = getQueryParam("id");
    $scope.cartItemCount = 0;

    // প্রাথমিক লোড: localStorage থেকে কার্ট ডেটা নিন
    $scope.loadCartCount = function () {
        var storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                var cartItems = JSON.parse(storedCart);
                $scope.cartItemCount = cartItems.length;
            } catch (e) {
                console.error("Error parsing cart from localStorage in layoutController:", e);
                $scope.cartItemCount = 0;
            }
        } else {
            $scope.cartItemCount = 0;
        }
    };

    // কন্ট্রোলার লোড হওয়ার সময় কার্ট গণনা লোড করুন
    $scope.loadCartCount();

    // যখন cartController থেকে 'cartUpdated' ইভেন্ট ব্রডকাস্ট হবে
    $rootScope.$on('cartUpdated', function () {
        // ইভেন্ট পাওয়ার পর সংখ্যাটি আপডেট করুন
        $scope.loadCartCount();
        // যদি UI সাথে সাথে আপডেট না হয়, $timeout ব্যবহার করতে পারেন
        // $timeout(function() {
        //     $scope.loadCartCount();
        // });
    });
    

    function LoadCategories() {
        Service.loadDataWithoutParm(baseUrl +'/Home/LoadCategory')
            .then(function (returnData) {
                $scope.categories = JSON.parse(returnData);
                // সব ক্যাটাগরিতে সাবক্যাটাগরির খালি অ্যারে অ্যাড করলাম
                $scope.categories.forEach(function (cat) {
                    cat.subcategories = [];
                    //cat.subLoaded = false;
                });
            });
    }

    $scope.showSubcategories = function (cat) {
        debugger;
        $scope.hoveredCategory = cat;
        $scope.activeCategory = cat;

        // যদি আগেই লোড হয়ে থাকে, আর লোড করবে না
        //if (cat.subLoaded) {
        //    return;
        //}

        Service.loadDataSingleParm(baseUrl +'/Home/LoadSubCategory', cat.categoryid)
            .then(function (returnData) {
                $scope.hoveredCategory.subcategories = JSON.parse(returnData);
                //cat.subLoaded = true;
            });
    };

    LoadCategories();

    

    $scope.viewProductDetails = function (product) {
        $scope.selectedProduct = product;
        $scope.showDetailsPage = true; // বিস্তারিত পেজ দেখান
    };


    $scope.LoginClick = function () {
        debugger;
        //console.log($scope.obj.T11999.username + " " + $scope.obj.T11999.password)
        if ($scope.obj.T11999.username != undefined && $scope.obj.T11999.username != '' && $scope.obj.T11999.password != undefined && $scope.obj.T11999.password != '') {
            //loader(true);
            var d = Service.login($scope.obj.T11999.username, $scope.obj.T11999.password);
            d.then(function (data) {
                const myArray = data.split("-");
                if (myArray[0] == '1') {
                    if (myArray[1] == '120') {
                        sweetAlertService.showSuccess('Login Successful!', 'Welcome back!');
                        window.location.href = baseUrl +"/Home/H00001";
                        // window.location.href = "/DT01111/DT01111";
                    } else if (myArray[1] == '101') {
                        window.location.href = baseUrl +"/Home/H00001";
                        /*window.location.href = "/Transaction/AT13001";*/
                    } else {
                        window.location.href = baseUrl +"/Home/H00001";
                    }
                    // window.location.href = "/Transaction/SendSms";
                    // loader(false);
                } else if (data == '2') {
                    sweetAlertService.showError('Login Failed!', 'User ID or password is wrong.');
                } else {
                    alert('You are not Authenticate user. Please Contact with 01515265289');
                }
            });
        } else {
            sweetAlertService.showWarning('Input Required', 'Please enter User ID and password.');
        }
    }

    $scope.Logout_Click = function () {
        window.location.href = baseUrl +'/Login/Logout'; // অথবা তোমার actual logout URL
    }


}]);