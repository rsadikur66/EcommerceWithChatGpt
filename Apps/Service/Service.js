app.service("Service", ["$http", function ($http) {
    var data = {
        saveData: saveData,
        loadDataWithoutParm: loadDataWithoutParm,
        loadDataSingleParm: loadDataSingleParm,
        loadDataListParm: loadDataListParm,
        saveData_Model_List: saveData_Model_List,
        saveData_List: saveData_List,
        save_Data_Two_List: save_Data_Two_List
    };
    return data;
    function saveData(controller, model) {
        try {
            var url = controller;
            return $http({
                url: url,
                method: "POST",
                data: { model: model }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
    function loadDataWithoutParm(controller) {
        try {
            var url = controller;
            var params = {};
            return $http({
                url: url,
                method: "POST",
                data: {}
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
    function loadDataSingleParm(controller, param) {
        try {
            var url = controller;
            var params = {};
            return $http({
                url: url,
                method: "POST",
                data: { param: param }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
    function loadDataListParm(controller, paramList) {
        try {
            var url = controller;
            return $http({
                url: url,
                method: "POST",
                data: { paramList: paramList }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
    function saveData_Model_List(controller, model, list) {
        try {
            var url = controller;
            return $http({
                url: url,
                method: "POST",
                data: { model: model, list: list }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
    function saveData_List(controller, list) {
        try {
            var url = controller;
            return $http({
                url: url,
                method: "POST",
                data: { list: list }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
    function save_Data_Two_List(controller, list_1, list_2) {
        try {
            var url = controller;
            return $http({
                url: url,
                method: "POST",
                data: { list_1: list_1, list_2: list_2 }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }
}
]);