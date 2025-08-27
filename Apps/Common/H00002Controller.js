app.controller('H00002Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "LoaderService", "baseUrlService", function ($scope, $rootScope, Service, Data, sweetAlertService, LoaderService, baseUrlService) {

    $scope.obj = {};
    $scope.obj = Data;
    $scope.modules = [];
    $scope.moduleName = 'Products';
    var baseUrl = baseUrlService.getBaseUrl();
    LoadModules();
    function LoadModules() {
        debugger;
        LoaderService.show();
        Service.loadDataWithoutParm(baseUrl + '/Home/LoadModules')
            .then(function (returnData) {
                var data = JSON.parse(returnData);
                $scope.obj.setupList = data.filter(x => x.T_LINK_SEPARATION === "1");
                $scope.obj.setupLength = $scope.obj.setupList.length;
                $scope.obj.transList = data.filter(x => x.T_LINK_SEPARATION === "2");
                $scope.obj.transLength = $scope.obj.transList.length;
                $scope.obj.reportList = data.filter(x => x.T_LINK_SEPARATION === "3");
                $scope.obj.reportLength = $scope.obj.reportList.length;
                LoaderService.hide();
            });
    }
    // Sample Data for Metrics
    $scope.metrics = {
        totalSales: 125000,
        totalOrders: 5432,
        newCustomers: 2100,
        avgOrderValue: 230
    };
    // Sample Data for Sales Trend (simplified)
    $scope.salesData = [
        { name: 'জানুয়ারী', sales: 4000 },
        { name: 'ফেব্রুয়ারী', sales: 3000 },
        { name: 'মার্চ', sales: 5000 },
        { name: 'এপ্রিল', sales: 4500 },
        { name: 'মে', sales: 6000 },
        { name: 'জুন', sales: 5500 },
    ];

    // Sample Data for Recent Orders
    $scope.recentOrders = [
        { id: '#ORD001', customer: 'আরিফ হোসেন', date: '২০২৩-০৭-২০', total: 5500, status: 'সম্পূর্ণ' },
        { id: '#ORD002', customer: 'নাসরিন আক্তার', date: '২০২৩-০৭-১৯', total: 2100, status: 'প্রক্রিয়াকরণ' },
        { id: '#ORD003', customer: 'সাকিব আহমেদ', date: '২০২৩-০৭-১৮', total: 1200, status: 'বাতিল' },
        { id: '#ORD004', customer: 'ফারজানা বেগম', date: '২০২৩-০৭-১৭', total: 8000, status: 'সম্পূর্ণ' },
    ];
    $scope.PageRedirect_Clic = function (link) {
        //loader(true)
        window.location.href = baseUrl + link;
        //window.location = link;
        //  $location.path(link);

    };

    $scope.Logout_Click = function () {
        Service.logout().then(function (response) {
            if (response.success) {
                // Redirect to login page
                window.location.href = '/';
            }
        }, function (error) {
            alert("Logout failed. Try again.");
        });
    };





}]);