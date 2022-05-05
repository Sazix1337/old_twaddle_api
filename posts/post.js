"use strict";
exports.__esModule = true;
var axios = require('axios')["default"];
var $posts = {
    send_request: function (url, data) {
        return new Promise(function (resolve, reject) {
            axios.post(url, data).then(function (response) {
                resolve(response);
            });
        });
    }
};
exports["default"] = $posts;
