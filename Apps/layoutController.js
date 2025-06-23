app.controller('LayoutController', ["$scope", "Service", function ($scope, Service) {
    $scope.sidebarVisible = false;
    $scope.hoveredCategory = null;
    $scope.activeCategory = null; // New variable to track active category for styling
    $scope.categories = [];   // Category লোড হওয়ার পর ভরবে


    //function getQueryParam(param) {
    //    var params = new URLSearchParams(window.location.search);
    //    return params.get(param);
    //}
    //var Id = getQueryParam("id");


    function LoadCategories() {
        Service.loadDataWithoutParm('/Home/LoadCategory')
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

        Service.loadDataSingleParm('/Home/LoadSubCategory', cat.categoryid)
            .then(function (returnData) {
                $scope.hoveredCategory.subcategories = JSON.parse(returnData);
                //cat.subLoaded = true;
            });
    };

    LoadCategories();

   
    //LoadCategories();
    //$scope.banners = [
    //    {
    //        imageUrl: 'AC_Common_Big_Banner_2_1_.jpg',
    //        altText: 'First slide',
    //        title: 'এই গরমে থাকুন আরামে',
    //        description: '80% পর্যন্ত ছাড়'
    //    },
    //    {
    //        imageUrl: 'big_banner_copy_1__1.jpg',
    //        altText: 'Second slide',
    //        title: 'নতুন অফার!',
    //        description: 'এক্সক্লুসিভ ডিল মিস করবেন না।'
    //    },
    //    {
    //        imageUrl: 'Gadget_Big_Banner_copy_1_1_.jpg',
    //        altText: 'Third slide',
    //        title: 'সীমিত সময়ের জন্য',
    //        description: 'আজই কিনুন!'
    //    }
    //];

    //function LoadCategories(){
    //    var load = Service.loadDataWithoutParm('/Home/LoadCategory');
    //    load.then(function (returnData) {
    //        $scope.categories = JSON.parse(returnData);
    //        console.log($scope.categories);
    //        //LoadSubCategories()
    //        //loadCategoryData();
    //    });
    //}

    //$scope.showSubcategories = function (catId) {
    //    var load = Service.loadDataSingleParm('/Home/LoadSubCategory', catId);
    //    load.then(function (returnData) {
    //        $scope.hoveredCategory.subcategories = JSON.parse(returnData);
    //        console.log($scope.hoveredCategory.subcategories);
    //        //loadCategoryData();
    //    });
    //}
   


    // Dummy data for categories - Replace with actual data from your backend
  

    //$scope.showSubcategories = function (category) {
    //    $scope.hoveredCategory = category;
    //    $scope.activeCategory = category; // Set active category for styling
    //};

    //$scope.hideSubcategories = function () {
    //    $scope.hoveredCategory = null;
    //    $scope.activeCategory = null; // Clear active category
    //};

    $scope.products = [
        {
            id: 300,
            image: 'https://placehold.co/400x300/F0F0F0/333333?text=Product+1', // আপনার পণ্যের ছবির URL দিয়ে প্রতিস্থাপন করুন
            name: 'গেমিং ল্যাপটপ',
            price: '৳ ৮৫,০০০',
            description: 'উচ্চ পারফরম্যান্সের গেমিং ল্যাপটপ, গেমিং এবং গ্রাফিক্সের কাজের জন্য উপযুক্ত।',
            buttonText: 'কার্টে যোগ করুন'
        },
        {
            id: 301,
            image: 'https://placehold.co/400x300/F0F0F0/333333?text=Product+2', // আপনার পণ্যের ছবির URL দিয়ে প্রতিস্থাপন করুন
            name: 'স্মার্টওয়াচ এক্স৩',
            price: '৳ ৭,৫০০',
            description: 'স্বাস্থ্য ট্র্যাকিং এবং নোটিফিকেশন সহ আধুনিক স্মার্টওয়াচ।',
            buttonText: 'কার্টে যোগ করুন'
        },
        {
            id: 302,
            image: 'https://placehold.co/400x300/F0F0F0/333333?text=Product+3', // আপনার পণ্যের ছবির URL দিয়ে প্রতিস্থাপন করুন
            name: 'ওয়্যারলেস হেডফোন',
            price: '৳ ২,৯৯৯',
            description: 'উচ্চমানের অডিও এবং দীর্ঘস্থায়ী ব্যাটারি ব্যাকআপ সহ হেডফোন।',
            buttonText: 'কার্টে যোগ করুন'
        },
        {
            id: 4,
            image: 'https://placehold.co/400x300/F0F0F0/333333?text=Product+4', // আপনার পণ্যের ছবির URL দিয়ে প্রতিস্থাপন করুন
            name: '4K স্মার্ট টিভি',
            price: '৳ ৫০,০০০',
            description: 'আলট্রা এইচডি রেসুলেশন এবং স্মার্ট ফিচার সহ টেলিভিশন।',
            buttonText: 'কার্টে যোগ করুন'
        }
    ];

    $scope.viewProductDetails = function (product) {
        $scope.selectedProduct = product;
        $scope.showDetailsPage = true; // বিস্তারিত পেজ দেখান
    };

}]);