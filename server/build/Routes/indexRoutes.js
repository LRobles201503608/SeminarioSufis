"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var indexController_1 = require("../controllers/indexController");
var IndexRoutes = /** @class */ (function () {
    function IndexRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    IndexRoutes.prototype.config = function () {
        this.router.get('/', indexController_1.indexController.index);
    };
    return IndexRoutes;
}());
var indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
