/**
 * SPDX-License-Identifier: CC-BY-SA-4.0
 * _addText: '{{Gadget Header|license=CC-BY-SA-4.0}}'
 *
 * @source <https://git.qiuwen.wiki/InterfaceAdmin/Gadgets/src/branch/master/src/Gadgets/GeoLocation>
 * @dependency ext.gadget.GeoJS, mediawiki.api, mediawiki.Title
 */
/**
 * +--------------------------------------------------------+
 * |         === WARNING: GLOBAL GADGET FILE ===            |
 * +--------------------------------------------------------+
 * |      All changes should be made in the repository,     |
 * |              otherwise they will be lost.              |
 * +--------------------------------------------------------+
 * |        Changes to this page affect many users.         |
 * |  Please discuss changes at Talk page before editing.   |
 * +--------------------------------------------------------+
 */
/* <nowiki> */
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
$( /*#__PURE__*/function () {
  var _geoLocation = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var _mw$config$get;
    var _yield$Geo, country, region, countryList, regionList, _countryList, _regionList, getCountryName, getRegionName, api, getLocation, storeLocation;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return Geo();
        case 2:
          _yield$Geo = _context4.sent;
          country = _yield$Geo.country;
          region = _yield$Geo.region;
          countryList = function countryList() {
            return {
              AF: '阿富汗',
              AX: '奥兰',
              AL: '阿尔巴尼亚',
              DZ: '阿尔及利亚',
              AS: '美属萨摩亚',
              AD: '安道尔',
              AO: '安哥拉',
              AI: '安圭拉',
              AQ: '南极洲',
              AG: '安提瓜和巴布达',
              AR: '阿根廷',
              AM: '亚美尼亚',
              AW: '阿鲁巴',
              AU: '澳大利亚',
              AT: '奥地利',
              AZ: '阿塞拜疆',
              BS: '巴哈马',
              BH: '巴林',
              BD: '孟加拉国',
              BB: '巴巴多斯',
              BY: '白俄罗斯',
              BE: '比利时',
              BZ: '伯利兹',
              BJ: '贝宁',
              BM: '百慕大',
              BT: '不丹',
              BO: '玻利维亚',
              BQ: '荷兰加勒比区',
              BA: '波黑',
              BW: '博茨瓦纳',
              BV: '布韦岛',
              BR: '巴西',
              IO: '英属印度洋领地',
              BN: '文莱',
              BG: '保加利亚',
              BF: '布基纳法索',
              BI: '布隆迪',
              CV: '佛得角',
              KH: '柬埔寨',
              CM: '喀麦隆',
              CA: '加拿大',
              KY: '开曼群岛',
              CF: '中非',
              TD: '乍得',
              CL: '智利',
              CN: '中国',
              CX: '圣诞岛',
              CC: '科科斯（基林）群岛',
              CO: '哥伦比亚',
              KM: '科摩罗',
              CG: '刚果共和国',
              CD: '刚果民主共和国',
              CK: '库克群岛',
              CR: '哥斯达黎加',
              CI: '科特迪瓦',
              HR: '克罗地亚',
              CU: '古巴',
              CW: '库拉索',
              CY: '塞浦路斯',
              CZ: '捷克',
              DK: '丹麦',
              DJ: '吉布提',
              DM: '多米尼克',
              DO: '多米尼加',
              EC: '厄瓜多尔',
              EG: '埃及',
              SV: '萨尔瓦多',
              GQ: '赤道几内亚',
              ER: '厄立特里亚',
              EE: '爱沙尼亚',
              SZ: '斯威士兰',
              ET: '埃塞俄比亚',
              FK: '福克兰群岛',
              FO: '法罗群岛',
              FJ: '斐济',
              FI: '芬兰',
              FR: '法国',
              GF: '法属圭亚那',
              PF: '法属波利尼西亚',
              TF: '法属南部和南极领地',
              GA: '加蓬',
              GM: '冈比亚',
              GE: '格鲁吉亚',
              DE: '德国',
              GH: '加纳',
              GI: '直布罗陀',
              GR: '希腊',
              GL: '格陵兰',
              GD: '格林纳达',
              GP: '瓜德罗普',
              GU: '关岛',
              GT: '危地马拉',
              GG: '根西',
              GN: '几内亚',
              GW: '几内亚比绍',
              GY: '圭亚那',
              HT: '海地',
              HM: '赫德岛和麦克唐纳群岛',
              VA: '梵蒂冈',
              HN: '洪都拉斯',
              HK: '中国香港',
              HU: '匈牙利',
              IS: '冰岛',
              IN: '印度',
              ID: '印尼',
              IR: '伊朗',
              IQ: '伊拉克',
              IE: '爱尔兰',
              IM: '马恩岛',
              IL: '以色列',
              IT: '意大利',
              JM: '牙买加',
              JP: '日本',
              JE: '泽西',
              JO: '约旦',
              KZ: '哈萨克斯坦',
              KE: '肯尼亚',
              KI: '基里巴斯',
              KP: '朝鲜',
              KR: '韩国',
              KW: '科威特',
              KG: '吉尔吉斯斯坦',
              LA: '老挝',
              LV: '拉脱维亚',
              LB: '黎巴嫩',
              LS: '莱索托',
              LR: '利比里亚',
              LY: '利比亚',
              LI: '列支敦士登',
              LT: '立陶宛',
              LU: '卢森堡',
              MO: '中国澳门',
              MG: '马达加斯加',
              MW: '马拉维',
              MY: '马来西亚',
              MV: '马尔代夫',
              ML: '马里',
              MT: '马耳他',
              MH: '马绍尔群岛',
              MQ: '马提尼克',
              MR: '毛里塔尼亚',
              MU: '毛里求斯',
              YT: '马约特',
              MX: '墨西哥',
              FM: '密克罗尼西亚联邦',
              MD: '摩尔多瓦',
              MC: '摩纳哥',
              MN: '蒙古',
              ME: '黑山',
              MS: '蒙特塞拉特',
              MA: '摩洛哥',
              MZ: '莫桑比克',
              MM: '缅甸',
              NA: '纳米比亚',
              NR: '瑙鲁',
              NP: '尼泊尔',
              NL: '荷兰',
              NC: '新喀里多尼亚',
              NZ: '新西兰',
              NI: '尼加拉瓜',
              NE: '尼日尔',
              NG: '尼日利亚',
              NU: '纽埃',
              NF: '诺福克岛',
              MK: '北马其顿',
              MP: '北马里亚纳群岛',
              NO: '挪威',
              OM: '阿曼',
              PK: '巴基斯坦',
              PW: '帕劳',
              PS: '巴勒斯坦',
              PA: '巴拿马',
              PG: '巴布亚新几内亚',
              PY: '巴拉圭',
              PE: '秘鲁',
              PH: '菲律宾',
              PN: '皮特凯恩群岛',
              PL: '波兰',
              PT: '葡萄牙',
              PR: '波多黎各',
              QA: '卡塔尔',
              RE: '留尼汪',
              RO: '罗马尼亚',
              RU: '俄罗斯',
              RW: '卢旺达',
              BL: '圣巴泰勒米',
              SH: '圣赫勒拿、阿森松和特里斯坦-达库尼亚',
              KN: '圣基茨和尼维斯',
              LC: '圣卢西亚',
              MF: '法属圣马丁',
              PM: '圣皮埃尔和密克隆',
              VC: '圣文森特和格林纳丁斯',
              WS: '萨摩亚',
              SM: '圣马力诺',
              ST: '圣多美和普林西比',
              SA: '沙特阿拉伯',
              SN: '塞内加尔',
              RS: '塞尔维亚',
              SC: '塞舌尔',
              SL: '塞拉利昂',
              SG: '新加坡',
              SX: '荷属圣马丁',
              SK: '斯洛伐克',
              SI: '斯洛文尼亚',
              SB: '所罗门群岛',
              SO: '索马里',
              ZA: '南非',
              GS: '南乔治亚和南桑威奇群岛',
              SS: '南苏丹',
              ES: '西班牙',
              LK: '斯里兰卡',
              SD: '苏丹',
              SR: '苏里南',
              SJ: '斯瓦尔巴和扬马延',
              SE: '瑞典',
              CH: '瑞士',
              SY: '叙利亚',
              TW: '中国臺湾',
              TJ: '塔吉克斯坦',
              TZ: '坦桑尼亚',
              TH: '泰国',
              TL: '东帝汶',
              TG: '多哥',
              TK: '托克劳',
              TO: '汤加',
              TT: '特立尼达和多巴哥',
              TN: '突尼斯',
              TR: '土耳其',
              TM: '土库曼斯坦',
              TC: '特克斯和凯科斯群岛',
              TV: '图瓦卢',
              UG: '乌干达',
              UA: '乌克兰',
              AE: '阿联酋',
              GB: '英国',
              US: '美国',
              UM: '美国本土外小岛屿',
              UY: '乌拉圭',
              UZ: '乌兹别克斯坦',
              VU: '瓦努阿图',
              VE: '委内瑞拉',
              VN: '越南',
              VG: '英属维尔京群岛',
              VI: '美属维尔京群岛',
              WF: '瓦利斯和富图纳',
              EH: '西撒哈拉',
              YE: '也门',
              ZM: '赞比亚',
              ZW: '津巴布韦'
            };
          };
          regionList = function regionList() {
            return {
              AH: '安徽',
              BJ: '北京',
              CQ: '重庆',
              FJ: '福建',
              GD: '广东',
              GS: '甘肃',
              GX: '广西',
              GZ: '贵州',
              HA: '河南',
              HB: '湖北',
              HE: '河北',
              HI: '海南',
              HL: '黑龙江',
              HN: '湖南',
              JL: '吉林',
              JS: '江苏',
              JX: '江西',
              LN: '辽宁',
              NM: '内蒙古',
              NX: '宁夏',
              QH: '青海',
              SC: '四川',
              SD: '山东',
              SH: '上海',
              SN: '陕西',
              SX: '山西',
              TJ: '天津',
              XJ: '新疆',
              XZ: '西藏',
              YN: '云南',
              ZJ: '浙江'
            };
          };
          _countryList = countryList();
          _regionList = regionList();
          getCountryName = function getCountryName(key) {
            return _countryList[key] || key;
          };
          getRegionName = function getRegionName(key) {
            return _regionList[key] || key;
          };
          api = new mw.Api();
          getLocation = /*#__PURE__*/function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              var IPGeolocationDesc, appendIcon, getUserGeoIP, response, groups;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    IPGeolocationDesc = 'IP属地';
                    appendIcon = function appendIcon(indicatorText, spanClass, icon) {
                      var $indicator = $('<div>').addClass("mw-indicator mw-indicator-geolocation mw-geolocation-".concat(spanClass)).attr('id', 'mw-indicator-geolocation').append($('<span>').addClass("mw-geolocation-filter-".concat(spanClass, " mw-geolocation-icon mw-geolocation-icon-").concat(icon !== null && icon !== void 0 ? icon : 'globe')).attr({
                        alt: indicatorText !== null && indicatorText !== void 0 ? indicatorText : IPGeolocationDesc,
                        title: indicatorText !== null && indicatorText !== void 0 ? indicatorText : IPGeolocationDesc
                      })).append($('<span>').addClass('mw-geolocation-text').text(indicatorText));
                      $indicator.appendTo($('.mw-indicators'));
                    };
                    getUserGeoIP = function getUserGeoIP() {
                      $.getJSON("".concat(mw.config.get('wgServer') + mw.config.get('wgScriptPath'), "/wiki/User:").concat(mw.config.get('wgRelevantUserName'), "/GeoIP.json?action=raw&ctype=application/json")).done(function (response) {
                        var _getCountryName, _getRegionName;
                        var countryText = (_getCountryName = getCountryName(response.country)) !== null && _getCountryName !== void 0 ? _getCountryName : '未知';
                        var regionText = response.country === 'CN' ? (_getRegionName = getRegionName(response.region)) !== null && _getRegionName !== void 0 ? _getRegionName : '' : '';
                        var indicatorText = "".concat(IPGeolocationDesc, "\uFF1A").concat(countryText).concat(regionText);
                        var spanClass = 'green';
                        appendIcon(indicatorText, spanClass, 'globe');
                      }).fail(function () {
                        var indicatorText = "".concat(IPGeolocationDesc, "\uFF1A\u672A\u77E5");
                        var spanClass = 'orange';
                        appendIcon(indicatorText, spanClass, 'helpNotice');
                      });
                    };
                    _context.prev = 3;
                    _context.next = 6;
                    return api.get({
                      action: 'query',
                      list: 'users',
                      ususers: mw.config.get('wgRelevantUserName'),
                      usprop: 'groups'
                    });
                  case 6:
                    response = _context.sent;
                    groups = response['query'].users[0].groups;
                    if ((groups.indexOf('autoconfirmed') !== -1 || groups.indexOf('confirmed') !== -1) && !(groups.indexOf('bot') !== -1)) {
                      getUserGeoIP();
                    } else if (groups.indexOf('bot') !== -1) {
                      appendIcon('机器人', 'blue', 'settings');
                    } else if (groups.indexOf('责任运营') !== -1) {
                      appendIcon('责任运营', 'blue', 'userAvatar');
                    }
                    _context.next = 13;
                    break;
                  case 11:
                    _context.prev = 11;
                    _context.t0 = _context["catch"](3);
                  case 13:
                  case "end":
                    return _context.stop();
                }
              }, _callee, null, [[3, 11]]);
            }));
            return function getLocation() {
              return _ref.apply(this, arguments);
            };
          }();
          storeLocation = /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
              var response;
              return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(country === '' || mw.config.get('wgUserGroups').indexOf('bot') !== -1 || mw.config.get('wgUserGroups').indexOf('qiuwen') !== -1 || !mw.config.get('wgUserName') || !(mw.config.get('wgUserGroups').indexOf('autoconfirmed') !== -1) || !(mw.config.get('wgUserGroups').indexOf('confirmed') !== -1))) {
                      _context2.next = 2;
                      break;
                    }
                    return _context2.abrupt("return");
                  case 2:
                    _context2.prev = 2;
                    _context2.next = 5;
                    return $.getJSON("".concat(mw.config.get('wgServer') + mw.config.get('wgScriptPath'), "/wiki/User:").concat(mw.config.get('wgUserName'), "/GeoIP.json?action=raw&ctype=application/json"));
                  case 5:
                    response = _context2.sent;
                    if (!(response.country === country || response.region === region)) {
                      _context2.next = 8;
                      break;
                    }
                    return _context2.abrupt("return");
                  case 8:
                    _context2.next = 12;
                    break;
                  case 10:
                    _context2.prev = 10;
                    _context2.t0 = _context2["catch"](2);
                  case 12:
                    _context2.next = 14;
                    return api.postWithEditToken({
                      action: 'edit',
                      title: "User:".concat(mw.config.get('wgUserName'), "/GeoIP.json"),
                      text: "{\"country\":\"".concat(country, "\",\"region\":\"").concat(region, "\"}"),
                      summary: '更新IP属地信息',
                      minor: 1,
                      watchlist: 'unwatch'
                    });
                  case 14:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, null, [[2, 10]]);
            }));
            return function storeLocation() {
              return _ref2.apply(this, arguments);
            };
          }();
          $( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
            var relevantUserPageName, pageName;
            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
              while (1) switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return storeLocation();
                case 2:
                  if (mw.config.get('wgRelevantUserName') && mw.config.get('wgNamespaceNumber') === 2 && mw.config.get('wgAction') === 'view') {
                    relevantUserPageName = new mw.Title(mw.config.get('wgRelevantUserName'), 2).toText();
                    pageName = new mw.Title(mw.config.get('wgPageName')).toText();
                    if (relevantUserPageName === pageName) {
                      getLocation();
                    }
                  }
                case 3:
                case "end":
                  return _context3.stop();
              }
            }, _callee3);
          })));
        case 15:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  function geoLocation() {
    return _geoLocation.apply(this, arguments);
  }
  return geoLocation;
}());
/* </nowiki> */