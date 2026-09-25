app.controller('T11232Controller', ["$scope", "$rootScope", "Service", "Data", "sweetAlertService", "LoaderService", "baseUrlService", function ($scope, $rootScope, Service, Data, sweetAlertService, LoaderService, baseUrlService) {
    $scope.obj = {};
    $scope.obj = Data;
    var baseUrl = baseUrlService.getBaseUrl();
    $scope.pageSize = 8;
    $scope.FormCode = "T11232";
    $scope.FormName = "T11232 - Stock / Inventory Adjustment";

    LoadProductStockList();

    function LoadProductStockList() {
        LoaderService.show();
        Service.loadDataWithoutParm(baseUrl + '/T11232/GetProductStockList')
            .then(function (returnData) {
                $scope.obj.productlists = JSON.parse(returnData);
                LoaderService.hide();
            })
            .catch(function () {
                LoaderService.hide();
            });
    }

    // ============================================================
    // Stock Adjust Modal
    // ============================================================
    $scope.adjustModal = {
        product: null,
        changeType: 'IN',
        quantity: null,
        reason: '',
        history: [],
        loadingHistory: false
    };

    $scope.openAdjustModal = function (product) {
        $scope.adjustModal.product = product;
        $scope.adjustModal.changeType = 'IN';
        $scope.adjustModal.quantity = null;
        $scope.adjustModal.reason = '';
        $scope.adjustModal.history = [];
        loadStockHistory(product.ProductId);
        $('#adjustStockModal').modal('show');
    };

    function loadStockHistory(productId) {
        $scope.adjustModal.loadingHistory = true;
        Service.loadDataSingleParm(baseUrl + '/T11232/GetStockMovementHistory', productId)
            .then(function (returnData) {
                $scope.adjustModal.history = JSON.parse(returnData);
                $scope.adjustModal.loadingHistory = false;
            })
            .catch(function () {
                $scope.adjustModal.loadingHistory = false;
            });
    }

    $scope.confirmStockAdjust = function () {
        if (!$scope.adjustModal.product || !$scope.adjustModal.quantity || $scope.adjustModal.quantity <= 0) {
            sweetAlertService.showError("Required!!!", "সঠিক পরিমাণ (quantity) দিন।");
            return;
        }

        LoaderService.show();
        Service.loadDataSingleParm(baseUrl + '/T11232/AdjustStock', {
            ProductID: $scope.adjustModal.product.ProductId,
            ChangeType: $scope.adjustModal.changeType,
            Quantity: $scope.adjustModal.quantity,
            Reason: $scope.adjustModal.reason
        }).then(function (result) {
            LoaderService.hide();
            if (result.success) {
                var newStock = $scope.adjustModal.changeType === 'IN'
                    ? $scope.adjustModal.product.StockQuantity + $scope.adjustModal.quantity
                    : $scope.adjustModal.product.StockQuantity - $scope.adjustModal.quantity;
                $scope.adjustModal.product.StockQuantity = newStock;

                $scope.adjustModal.quantity = null;
                $scope.adjustModal.reason = '';
                loadStockHistory($scope.adjustModal.product.ProductId);
                sweetAlertService.showResponseMessage("স্টক সফলভাবে আপডেট হয়েছে-1");
            } else {
                sweetAlertService.showError("ব্যর্থ হয়েছে!", result.message || "স্টক আপডেট করা যায়নি।");
            }
        }).catch(function () {
            LoaderService.hide();
            sweetAlertService.showError("ব্যর্থ হয়েছে!", "স্টক আপডেট করার সময় একটি সমস্যা হয়েছে।");
        });
    };
}]);