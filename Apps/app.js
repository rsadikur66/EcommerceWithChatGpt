var app = angular.module('myApp', []);

app.factory('Data', function () {
    return { obj: '' };
});

// ধাপ ১: লোডার সার্ভিস তৈরি করুন
// এই সার্ভিসটি লোডারের স্ট্যাটাস (দেখাচ্ছে নাকি লুকাচ্ছে) ট্র্যাক করবে
app.factory('loaderService', ['$rootScope', function ($rootScope) {
    var loaderCount = 0; // কতগুলো HTTP রিকোয়েস্ট পেন্ডিং আছে তার কাউন্টার

    return {
        // লোডার দেখানোর জন্য
        show: function () {
            loaderCount++;
            // 'loader_show' ইভেন্ট ব্রডকাস্ট করুন যাতে UI আপডেট হয়
            $rootScope.$broadcast('loader_show');
        },
        // লোডার লুকানোর জন্য
        hide: function () {
            loaderCount--;
            if (loaderCount <= 0) { // যদি কোনো রিকোয়েস্ট পেন্ডিং না থাকে
                loaderCount = 0; // নিশ্চিত করুন যে কাউন্টার ০ এর নিচে না যায়
                // 'loader_hide' ইভেন্ট ব্রডকাস্ট করুন যাতে UI আপডেট হয়
                $rootScope.$broadcast('loader_hide');
            }
        },
        // বর্তমান লোডার স্ট্যাটাস চেক করার জন্য (ঐচ্ছিক, সরাসরি ব্যবহার নাও হতে পারে)
        isLoading: function () {
            return loaderCount > 0;
        }
    };
}]);

// ধাপ ২: HTTP Interceptor তৈরি করুন
// এই ইন্টারসেপ্টরটি প্রতিটি HTTP রিকোয়েস্ট এবং রেসপন্স মনিটর করবে
app.factory('httpInterceptor', ['$q', 'loaderService', function ($q, loaderService) {
    return {
        // রিকোয়েস্ট পাঠানোর আগে
        request: function (config) {
            loaderService.show(); // রিকোয়েস্ট শুরু হলে লোডার দেখান
            return config;
        },

        // সফল রেসপন্স পেলে
        response: function (response) {
            loaderService.hide(); // রেসপন্স পেলে লোডার লুকান
            return response;
        },

        // এরর রেসপন্স পেলে
        responseError: function (rejection) {
            loaderService.hide(); // এরর হলেও লোডার লুকান
            // এরর প্রসেসিং লজিক (যদি থাকে)
            return $q.reject(rejection); // এররটি প্রপাগেট করুন
        }
    };
}]);

// ধাপ ৩: Interceptor-কে AngularJS কনফিগ করুন
// আপনার অ্যাপ মডিউলের config ব্লকে httpInterceptor-কে $httpProvider-এ যোগ করুন
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);
// app.js বা services/sweetAlertService.js
app.factory('sweetAlertService', ['$q', function ($q) {
    // SweetAlert2 গ্লোবাল অবজেক্ট (Swal) ব্যবহার করে ফাংশনগুলো তৈরি করুন
    return {
        // সফল মেসেজ দেখানোর জন্য
        showSuccess: function (title, text) {
            return Swal.fire({
                title: title || 'Success!',
                text: text || 'Operation completed successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        },

        // এরর মেসেজ দেখানোর জন্য
        showError: function (title, text) {
            return Swal.fire({
                title: title || 'Error!',
                text: text || 'Something went wrong.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        },

        // ওয়ার্নিং মেসেজ দেখানোর জন্য
        showWarning: function (title, text) {
            return Swal.fire({
                title: title || 'Warning!',
                text: text || 'Please be careful.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        },

        // ইনফো মেসেজ দেখানোর জন্য
        showInfo: function (title, text) {
            return Swal.fire({
                title: title || 'Info',
                text: text || 'Here is some information.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        },

        // নিশ্চিতকরণ ডায়ালগ দেখানোর জন্য
        showConfirm: function (title, text, confirmButtonText, cancelButtonText) {
            confirmButtonText = confirmButtonText || 'Yes, proceed!';
            cancelButtonText = cancelButtonText || 'No, cancel!';

            return Swal.fire({
                title: title || 'Are you sure?',
                text: text || "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText
            });
        },

        // কাস্টম অপশন সহ SweetAlert দেখানোর জন্য
        showCustom: function (options) {
            return Swal.fire(options);
        }
    };
}]);
