"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function () {
    var running = false;
    var resArray = [];
    var sizes = ["small", "medium", "large", "larger"];
    window.oouiDialog = Object.fromEntries(["alert", "confirm", "prompt"].map(function (method) { return [method, function (text_jQuery, _option) { return __awaiter(void 0, void 0, void 0, function () {
            var option, base, rect, windowWidth_1, acceptableSize, config, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        option = $.isPlainObject(_option) ? _option : {};
                        base = {
                            size: "medium",
                        };
                        if (option.allowFullscreen !== true) {
                            rect = OO.ui.Element.static.getDimensions(window).rect;
                            windowWidth_1 = rect.right - rect.left;
                            acceptableSize = sizes.filter(function (s) { return OO.ui.WindowManager.static.sizes[s].width < windowWidth_1; });
                            base.size = sizes.includes(option.size) ? acceptableSize.length > 0 ? acceptableSize.includes(option.size) ? option.size : acceptableSize[acceptableSize.length - 1] : "small" : "small";
                        }
                        else {
                            base.size = __spreadArray(__spreadArray([], __read(sizes), false), ["full"], false).includes(option.size) ? option.size : "small";
                        }
                        if (method === "prompt") {
                            config = $.extend({
                                autocomplete: false,
                            }, $.isPlainObject(option.textInput) ? option.textInput : {});
                            base.textInput = new OO.ui.TextInputWidget(config);
                            if (option.required) {
                                base.textInput.setIndicator(config.indicator || "required");
                                base.textInput.setValidation(config.validate || "non-empty");
                            }
                        }
                        return [4, new Promise(function (res) {
                                if (running) {
                                    resArray.push(res);
                                }
                                else {
                                    running = true;
                                    res();
                                }
                            })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 12, 13]);
                        result = void 0;
                        _b.label = 3;
                    case 3:
                        if (!(Number.MAX_SAFE_INTEGER > Number.MIN_SAFE_INTEGER)) return [3, 11];
                        return [4, OO.ui[method](text_jQuery instanceof $ ? text_jQuery : $("<p>").html(text_jQuery), $.extend({
                                title: "皮皮の提醒",
                            }, option, base))];
                    case 4:
                        result = _b.sent();
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 8, , 10]);
                        if (!(base.textInput && result !== null)) return [3, 7];
                        return [4, base.textInput.getValidity()];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [3, 11];
                    case 8:
                        _a = _b.sent();
                        return [4, OO.ui.alert($("<p>").html("您没有在刚才的输入框内填写符合要求的信息，请重新填写！"), $.extend({}, option, base, {
                                title: "未填写符合要求的信息",
                                textInput: null,
                            }))];
                    case 9:
                        _b.sent();
                        return [3, 3];
                    case 10: return [3, 3];
                    case 11: return [2, result];
                    case 12:
                        if (resArray.length > 0) {
                            resArray.shift()();
                        }
                        else {
                            running = false;
                        }
                        return [7];
                    case 13: return [2];
                }
            });
        }); }]; }));
    var sanity = $("<span>");
    window.oouiDialog.sanitize = function (text) { return sanity.text(text).html(); };
})();
