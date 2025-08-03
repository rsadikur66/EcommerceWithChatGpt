app.service("Service", ["$http", function ($http) {
    var data = {
        saveData: saveData,
        loadDataWithoutParm: loadDataWithoutParm,
        loadDataSingleParm: loadDataSingleParm,
        loadDataListParm: loadDataListParm,
        saveData_Model_List: saveData_Model_List,
        saveData_List: saveData_List,
        save_Data_Two_List: save_Data_Two_List,
        saveDataWithFile: saveDataWithFile, // ✅ এখানে যোগ করো
        login: login,
        logout: logout,
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
    function getBaseUrl() {
        var origin = window.location.origin;
        var pathSegments = window.location.pathname.split('/').filter(p => p);

        // লোকালহোস্ট হলে সরাসরি origin রিটার্ন করো
        if (origin.includes("localhost")) {
            return origin;
        }

        // hosted ভার্সন হলে origin এর সাথে প্রথম segment যুক্ত করে রিটার্ন করো
        if (origin.includes("bsite.net") && pathSegments.length > 0) {
            return origin + "/" + pathSegments[0] + "/";
        }

        // fallback
        return origin ;
    }


    function login(userId, pass) {
        //var baseUrl = window.location.origin + "/sadikislam6610";
        var baseUrl = getBaseUrl();
        //var baseUrl = window.location.origin;
        try {
            var url = baseUrl + '/Login/UserLogin';
            var params = {};
            return $http({
                url: url,
                method: "POST",
                //data: params
                data: { userId: userId, pass: pass }
            }).then(function (results) {

                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }

    function logout() {
        //var baseUrl = window.location.origin + window.location.pathname;
        var baseUrl = window.location.origin;
        try {
            var url = baseUrl + '/Login/Logout';
            var params = {};
            return $http({
                url: url,
                method: "POST",
                //data: params
                data: { }
            }).then(function (results) {

                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }

    function saveDataWithFile(controller, formData) {
        try {
            var url = controller;
            return $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (results) {
                return results.data;
            }).catch(function (ex) {
                throw ex;
            });
        } catch (ex) {
            throw ex;
        }
    }



}]);