import {
    Base64
} from 'js-base64';

let md5 = require('md5');
export default class WebUtils {
    static log(str) {
        //将日志输出到原生代码中
        if (typeof (NSLog) !== 'undefined')
            NSLog(str);
        //将日志输出到浏览器console中
        console.log(str);
    }

    static isWeb() {
        return true;
    }

    //re 0:表示成功 其他表示：Error
    static _fcnF(fcn, re, data = null) {
        if (typeof (fcn) !== 'undefined') {
            if (data == null)
                fcn(re);
            else
                fcn(data);
        }
    }

    static test() {
        WebUtils.testMD5();
        WebUtils.testBase64();
    }

    static dateNow() {
        let start = Date.now();
        return start;
    }

    static timeMD5() {
        let start = Date.now();
        let strTime = "{0}".format(start);
        let strMD5 = WebUtils.io_getmd5(strTime);
        return strMD5;
    }

    //-----------MD5------------
    static io_getmd5(str) {
        if (window.Settings.enableLog)
            WebUtils.log("WebUtils.io_getmd5({0})".format(str));
        return md5(str);
    }

    static testMD5() {
        WebUtils.log("WebUtils.testMD5()");
        //78e731027d8fd50ed642340b7c9a63b3
        console.log(md5('message'));
    }

    //-----------Base64-----------
    static encodeBase64(str) {
        // if (window.Settings.enableLog)
        //     WebUtils.log("WebUtils.encodeBase64({0})".format(str));
        return Base64.encode(str);
    }

    static decodeBase64(str) {
        if (window.Settings.enableLog)
            WebUtils.log("WebUtils.decodeBase64({0})".format(str));
        return Base64.decode(str);
    }

    static testBase64() {
        WebUtils.log("WebUtils.testBase64()");
        console.log(Base64.encode('dankogai'));
        console.log(Base64.decode('ZGFua29nYWk='));
    }
}