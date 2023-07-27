"use strict";
(function () {
    var script = document.createElement("script");
    script.src = "https://polyfill.alicdn.com/v3/polyfill.js?features=Array.from%2CArray.isArray%2CArray.prototype.copyWithin%2CArray.prototype.entries%2CArray.prototype.every%2CArray.prototype.fill%2CArray.prototype.filter%2CArray.prototype.find%2CArray.prototype.findIndex%2CArray.prototype.flat%2CArray.prototype.forEach%2CArray.prototype.includes%2CArray.prototype.indexOf%2CArray.prototype.keys%2CArray.prototype.lastIndexOf%2CArray.prototype.map%2CArray.prototype.reduce%2CArray.prototype.sort%2CArray.prototype.values%2CArrayBuffer%2CArrayBuffer.isView%2CBlob%2CDOMTokenList.prototype.forEach%2CDOMTokenList.prototype.replace%2CDataView%2CDate.now%2CDate.prototype.toISOString%2CDocumentFragment.prototype.append%2CDocumentFragment.prototype.prepend%2CElement.prototype.after%2CElement.prototype.animate%2CElement.prototype.append%2CElement.prototype.before%2CElement.prototype.classList%2CElement.prototype.closest%2CElement.prototype.matches%2CElement.prototype.nextElementSibling%2CElement.prototype.prepend%2CElement.prototype.remove%2CElement.prototype.replaceWith%2CElement.prototype.scrollIntoView%2CFloat32Array%2CFloat64Array%2CFunction.prototype.bind%2CFunction.prototype.name%2CInt16Array%2CInt32Array%2CInt8Array%2CIntersectionObserver%2CIntl%2CIntl.DateTimeFormat%2CIntl.ListFormat%2CIntl.NumberFormat%2CIntl.RelativeTimeFormat%2CJSON%2CMap%2CMath.sign%2CMath.trunc%2CMutationObserver%2CNode.prototype.contains%2CNodeList.prototype.forEach%2CNumber.MAX_SAFE_INTEGER%2CNumber.MIN_SAFE_INTEGER%2CNumber.isNaN%2CNumber.isSafeInteger%2CObject.assign%2CObject.create%2CObject.defineProperties%2CObject.defineProperty%2CObject.entries%2CObject.fromEntries%2CObject.getOwnPropertyNames%2CObject.getPrototypeOf%2CObject.is%2CObject.keys%2CObject.setPrototypeOf%2CObject.values%2CPromise%2CReflect%2CReflect.construct%2CReflect.defineProperty%2CReflect.deleteProperty%2CReflect.has%2CReflect.ownKeys%2CRegExp.prototype.flags%2CResizeObserver%2CSet%2CString.fromCodePoint%2CString.prototype.anchor%2CString.prototype.codePointAt%2CString.prototype.endsWith%2CString.prototype.fixed%2CString.prototype.includes%2CString.prototype.link%2CString.prototype.normalize%2CString.prototype.padStart%2CString.prototype.repeat%2CString.prototype.startsWith%2CString.prototype.trim%2CSymbol%2CSymbol.iterator%2CSymbol.prototype.description%2CSymbol.species%2CSymbol.toPrimitive%2CURL%2CURL.prototype.toJSON%2CURLSearchParams%2CUint16Array%2CUint32Array%2CUint8Array%2CUint8ClampedArray%2CWeakMap%2CXMLHttpRequest%2Catob%2Cconsole%2Cconsole.debug%2Cconsole.error%2Cconsole.info%2Cconsole.log%2Cconsole.warn%2Cdocument%2Cfetch%2CgetComputedStyle%2CglobalThis%2ClocalStorage%2CmatchMedia";
    script.async = true;
    var polyfillPromise = new Promise(function (res) {
        script.addEventListener("load", function () { return res(); }, {
            once: true,
        });
        script.addEventListener("error", function () { return res(); }, {
            once: true,
        });
    });
    Object.defineProperty(window, "polyfillPromise", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: polyfillPromise,
    });
})();
