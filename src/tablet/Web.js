import Database from './Database';
import SoundPlayer from './SoundPlayer';
import WebUtils from './WebUtils';
import RecordSound from './RecordSound'

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

export default class Web {
    static init() {
        Database.open("ScratchJrTest");
        // Database.test();
        SoundPlayer.init(function (nRe) {
            if (nRe == 0)
                RecordSound.loadAllSound()
        });
        // WebUtils.test()
    }

    static database_stmt(json, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.database_stmt({0})".format(json));
        Database.stmt(json, fcn);
    }

    static database_query(json, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.database_query({0})".format(json));
        Database.query(json, fcn);
    }

    static io_cleanassets(fileType, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_cleanassets({0})".format(fileType));
        Database.cleanassets(fileType, fcn);
    }
    
    static io_getsettings() {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getsettings()");
        let strData = "Documents,0,YES,YES";
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getsettings() - {0}".format(strData));
        return strData;
    }

    static io_getmedia(file, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getmedia({0})".format(file));
        Database.getmedia(file, fcn);
    }

    static io_setmedia(contents, ext, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_setmedia({0},{1})".format(contents, ext));
        let key = Database.getMD5(contents);
        let md5 = "{0}.{1}".format(key, ext);
        Database._writeToURL(md5, contents, fcn);
    }

    static io_setmedianame(contents, key, ext, fcn) {
        WebUtils.log("Web.io_setmedianame({0},{1},{2})".format(contents, key, ext));
        let md5 = "{0}.{1}".format(key, ext);
        Database._writeToURL(md5, contents, fcn);
    }

    static io_getmd5(str) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getmd5({0})".format(str));
        return WebUtils.io_getmd5(str)
    }

    static io_remove(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_remove({0})".format(filename));
        Database.removeFile(filename, fcn);
    }

    static io_getfile(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getfile({0})".format(filename));
        Database.getfile(filename, fcn);
    }

    static io_setfile(filename, base64ContentStr, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_setfile({0},{1})".format(filename, base64ContentStr));
        Database.setfile(filename, base64ContentStr, fcn);
    }

    static io_registersound(dir, name, fcn) {
        //if (window.Settings.enableLog)
        //    WebUtils.log("Web.io_registersound({0},{1})".format(dir, name));
        return SoundPlayer.io_registersound(dir, name, fcn);
    }

    static io_playsound(name) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_playsound({0})".format(name));
        return SoundPlayer.io_playsound(name);
    }

    static io_stopsound(name) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_stopsound({0})".format(name));
        return SoundPlayer.io_stopsound(name);
    }

    static recordsound_recordstart(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_recordstart()");
        RecordSound.recordsound_recordstart(fcn);
    }

    static recordsound_recordstop(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_recordstop()");
        RecordSound.recordsound_recordstop(fcn)
    }

    static recordsound_volume(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_volume()");
        RecordSound.recordsound_volume(fcn);
    }

    static recordsound_startplay(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_startplay()");
        RecordSound.recordsound_startplay(fcn);
    }

    static recordsound_stopplay(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("recordsound_stopplay()");
        RecordSound.recordsound_stopplay(fcn);
    }

    static recordsound_recordclose(keep, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_recordclose({0})".format(keep));
        RecordSound.recordsound_recordclose(keep, fcn);
    }

    static askForPermission() {
        if (window.Settings.enableLog)
            WebUtils.log("Web.askForPermission()");
        RecordSound.askForPermission();
    }

    static scratchjr_cameracheck() {
        WebUtils.log("scratchjr_cameracheck()");
    }

    static scratchjr_startfeed(str) {
        WebUtils.log("scratchjr_startfeed({0})".format(str));
    }

    static scratchjr_stopfeed() {
        WebUtils.log("scratchjr_stopfeed()");
    }

    static scratchjr_choosecamera(body) {
        WebUtils.log("Web.scratchjr_choosecamera({0})".format(body));
    }

    static scratchjr_captureimage(onCameraCaptureComplete) {
        WebUtils.log("Web.scratchjr_captureimage({0})".format(onCameraCaptureComplete));
    }

    static hideSplash() {
        WebUtils.log("Web.hideSplash({0})".format());
    }

    static sendSjrUsingShareDialog(fileName, emailSubject, emailBody, shareType, b64data) {
        WebUtils.log("Web.sendSjrUsingShareDialog({0},{1},{2},{3},{4})".format(fileName, emailSubject, emailBody, shareType, b64data));
    }

    static deviceName() {
        let strName = "WebOS";
        WebUtils.log("Web.deviceName() - (0)".format(strName));
        return strName
    }

    static analyticsEvent(category, action, label) {
        WebUtils.log("Web.analyticsEvent({0},{1},{2})".format(category, action, label));
    }

    static setAnalyticsPlacePref(place) {
        WebUtils.log("Web.setAnalyticsPlacePref({0})".format(place));
    }
}
