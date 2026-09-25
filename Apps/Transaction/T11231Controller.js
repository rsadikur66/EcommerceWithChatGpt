app.controller('T11231Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "LoaderService", "baseUrlService", function ($scope, $rootScope, Service, Data, sweetAlertService, LoaderService, baseUrlService) {
    $scope.obj = {};
    $scope.obj = Data;
    $scope.obj.T11231 = {};
    var baseUrl = baseUrlService.getBaseUrl();
    $scope.pageSize = 5;
    LoadOrderList();
    $scope.FormCode = "T11231";
    $scope.FormName = "T11231-Order List Page";
    $scope.selectedCategory = null;


    function LoadOrderList() {
        LoaderService.show();
        Service.loadDataWithoutParm(baseUrl + '/T11231/GetOrderList')
            .then(function (returnData) {
                $scope.obj.orderlists = JSON.parse(returnData);
                //console.log($scope.obj.categories);
                //cat.subLoaded = true;
            });
        LoaderService.hide();
    }
    $scope.btnOrderDetails = function (order) {
        // অ্যাডমিন যেকোনো কাস্টমারের অর্ডার দেখতে পারবে — তাই T11231Controller এর
        // আলাদা OrderInvoice অ্যাকশন ব্যবহার করা হচ্ছে (Home/InvoiceReport না, কারণ
        // সেটাতে শুধু অর্ডারের মালিক নিজের অর্ডার দেখতে পারে)
        window.open(baseUrl + '/T11231/OrderInvoice?orderId=' + order.OrderID, '_blank');
    };

    // ============================================================
    // Order Status Update — মডালের ভেতরে ড্রপডাউন থেকে নতুন status
    // সিলেক্ট করে আপডেট করা, এবং T11226 থেকে হিস্টোরি টাইমলাইন দেখানো
    // ============================================================
    $scope.statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    $scope.statusModal = { order: null, newStatus: '', history: [], loadingHistory: false };

    $scope.openStatusModal = function (order) {
        $scope.statusModal.order = order;
        $scope.statusModal.newStatus = order.OrderStatus || 'Pending';
        $scope.statusModal.history = [];
        loadStatusHistory(order.OrderID);
        $('#statusModal').modal('show');
    };

    function loadStatusHistory(orderId) {
        $scope.statusModal.loadingHistory = true;
        Service.loadDataSingleParm(baseUrl + '/T11231/GetOrderStatusHistory', orderId)
            .then(function (returnData) {
                $scope.statusModal.history = JSON.parse(returnData);
                $scope.statusModal.loadingHistory = false;
            })
            .catch(function () {
                $scope.statusModal.loadingHistory = false;
            });
    }

    $scope.confirmStatusUpdate = function () {
        if (!$scope.statusModal.order || !$scope.statusModal.newStatus) {
            return;
        }

        LoaderService.show();
        Service.loadDataSingleParm(baseUrl + '/T11231/UpdateOrderStatus', {
            OrderID: $scope.statusModal.order.OrderID,
            Status: $scope.statusModal.newStatus
        }).then(function (result) {
            LoaderService.hide();
            if (result.success) {
                $scope.statusModal.order.OrderStatus = $scope.statusModal.newStatus;
                loadStatusHistory($scope.statusModal.order.OrderID);
                sweetAlertService.showResponseMessage("অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে-1");
            } else {
                sweetAlertService.showError("ব্যর্থ হয়েছে!", result.message || "স্ট্যাটাস আপডেট করা যায়নি।");
            }
        }).catch(function () {
            LoaderService.hide();
            sweetAlertService.showError("ব্যর্থ হয়েছে!", "স্ট্যাটাস আপডেট করার সময় একটি সমস্যা হয়েছে।");
        });
    };

    $scope.btnSaveClick = function () {

        if ($scope.obj.T11221.Name == "" || $scope.obj.T11221.Name == undefined) {
            sweetAlertService.showError("Required!!!", "Please input required field.");
            return;
        }
        //var file = document.getElementById('uploadFile').files[0];
        //var formdata = new FormData();
        //formdata.append('CATEGORY_ID', $scope.obj.cat.CATEGORY_ID);
        //formdata.append('T_LANG2_NAME', $scope.obj.cat.T_LANG2_NAME);
        ////...
        //formdata.append('ICON', file);
        console.log($scope.obj.T11221);
        var save = Service.saveData(baseUrl + '/T11221/SaveData', $scope.obj.T11221);
        save.then(function (msg) {
            debugger;
            sweetAlertService.showResponseMessage(msg);
            LoadCategories();
        })


        //var insert = Service.saveData($scope.obj.T11221);
        //insert.then(function (data) {
        //    if (data) {
        //        alert("Data Save Successfully.")
        //    } else {
        //        alert("Data not Saved. Try Again.")
        //    }
        //    //var msg = data;
        //    //alert(msg);
        //    getCategoriesData();
        //    clear();
        //});
    }

    $scope.selectCategory = function (data) {
        $scope.obj.T11221.CategoryId = data.CategoryId;
        $scope.obj.T11221.Name = data.Name;
        $scope.obj.T11221.Description = data.Description;
        $scope.selectedCategory = data.CategoryId;
        //$scope.buttonText = "Update";
        //$('#myCategoryModal').modal('toggle');
        $('#myCategoryModal').modal('show');
        /* $("#myCategoryModal").modal();*/
    };


    $scope.btnClearClick = function () {
        $scope.obj.T11221 = {};
    }
}]);