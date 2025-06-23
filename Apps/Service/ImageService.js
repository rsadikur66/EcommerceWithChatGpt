app.service("ImageService", ["$http", "akFileUploaderService", function ($http, akFileUploaderService) {
    var data = {
        saveData: saveData,
        //getAllCatagoryData: getAllCatagoryData,
        //getAllProductData: getAllProductData,
       // getAllImage: getAllImage,
       // actv_Inactv: actv_Inactv
    };
    return data;
    function saveData(modelData) {
        return akFileUploaderService.saveModel(modelData, "../T14003/Insert");
    }
    //function getAllImage() {
    //    try {
    //        var url = '../T14007/GetAllImage';
    //        var params = {};
    //        return $http({
    //            url: url,
    //            method: "POST",
    //            data: {}
    //        }).then(function (results) {
    //            return results.data;
    //        }).catch(function (ex) {
    //            throw ex;
    //        });
    //    } catch (ex) {
    //        throw ex;
    //    }
    //}
    //function actv_Inactv(id, flag) {
    //    try {
    //        var url = '../T14007/Actv_Inactv';
    //        return $http({
    //            url: url,
    //            method: "POST",
    //            data: { id: id, flag: flag }
    //        }).then(function (results) {
    //            return results.data;
    //        }).catch(function (ex) {
    //            throw ex;
    //        });
    //    } catch (ex) {
    //        throw ex;
    //    }
    //}
}
]);