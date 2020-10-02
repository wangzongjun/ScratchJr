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

    //1- (NSString *)database_stmt:(NSString *) json;
    static database_stmt(json, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.database_stmt({0})".format(json));
        Database.stmt(json, fcn);
    }

    //2- (NSString *)database_query:(NSString *) json;
    static database_query(json, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.database_query({0})".format(json));
        Database.query(json, fcn);
    }

    //3- (void)      io_cleanassets:(NSString *)fileType;
    static io_cleanassets(fileType, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_cleanassets({0})".format(fileType));
        Database.cleanassets(fileType, fcn);
    }

    //4- (NSString *)io_getmedialen:(NSString *)file :(NSString *)key;
    static io_getmedialen(file, key, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getmedialen({0},{1})".format(file, key));
        Database.getmedialen(file, key, fcn);
    }

    //5- (NSString *)io_getmediadata:(NSString *)filename :(int)offset :(int)length;
    static io_getmediadata(filename, offset, length, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getmediadata({0},{1},{2})".format(filename, offset, length));
        Database.getmediadata(filename, offset, length, fcn);
    }

    //6- (NSString *)io_getsettings;
    static io_getsettings() {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getsettings()");
        let strData = "Documents,0,YES,YES";
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getsettings() - {0}".format(strData));
        return strData;
    }

    //7- (NSString *)io_getmediadone:(NSString *)filename;
    static io_getmediadone(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getmediadone({0})".format(filename));
        Database.getmediadone(filename, fcn);
    }

    //8- (NSString *)io_setmedia:(NSString *)contents :(NSString *)ext;
    static io_setmedia(contents, ext, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_setmedia({0},{1})".format(contents, ext));
        let key = Database.getMD5(contents);
        let md5 = "{0}.{1}".format(key, ext);
        Database._writeToURL(md5, contents, fcn);
    }

    //9- (NSString *)io_setmedianame:(NSString *)contents :(NSString *)key :(NSString *)ext;
    static io_setmedianame(contents, key, ext, fcn) {
        WebUtils.log("Web.io_setmedianame({0},{1},{2})".format(contents, key, ext));
        let md5 = "{0}.{1}".format(key, ext);
        Database._writeToURL(md5, contents, fcn);
    }

    //10- (NSString *)io_getmd5:(NSString *) str;
    static io_getmd5(str) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getmd5({0})".format(str));
        return WebUtils.io_getmd5(str)
    }

    //11- (NSString *)io_remove:(NSString *)filename;
    static io_remove(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_remove({0})".format(filename));
        Database.removeFile(filename, fcn);
    }

    //12- (NSString *)io_getfile:(NSString *)filename;
    static io_getfile(filename, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_getfile({0})".format(filename));
        Database.getfile(filename, fcn);
    }

    //13- (NSString *)io_setfile:(NSString *)filename :(NSString *)base64ContentStr;
    static io_setfile(filename, base64ContentStr, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_setfile({0},{1})".format(filename, base64ContentStr));
        Database.setfile(filename, base64ContentStr, fcn);
    }

    //14- (NSString *)io_registersound:(NSString *)dir :(NSString *)name;
    static io_registersound(dir, name, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_registersound({0},{1})".format(dir, name));
        return SoundPlayer.io_registersound(dir, name, fcn);
    }

    //15- (NSString *)io_playsound:(NSString *)name;
    static io_playsound(name) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_playsound({0})".format(name));
        return SoundPlayer.io_playsound(name);
    }

    //16- (NSString *)io_stopsound:(NSString *)name
    static io_stopsound(name) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.io_stopsound({0})".format(name));
        return SoundPlayer.io_stopsound(name);
    }

    //17- (NSString *)recordsound_recordstart;
    static recordsound_recordstart(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_recordstart()");
        RecordSound.recordsound_recordstart(fcn);
    }

    //18- (NSString *)recordsound_recordstop;
    static recordsound_recordstop(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_recordstop()");
        RecordSound.recordsound_recordstop(fcn)
    }

    //19- (NSString *)recordsound_volume;
    static recordsound_volume(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_volume()");
        RecordSound.recordsound_volume(fcn);
    }

    //20- (NSString *)recordsound_startplay;
    static recordsound_startplay(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_startplay()");
        RecordSound.recordsound_startplay(fcn);
    }

    //21- (NSString *)recordsound_stopplay;
    static recordsound_stopplay(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("recordsound_stopplay()");
        RecordSound.recordsound_stopplay(fcn);
    }

    //22- (NSString *)recordsound_recordclose:(NSString *)keep;
    static recordsound_recordclose(keep,fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("Web.recordsound_recordclose({0})".format(keep));
        RecordSound.recordsound_recordclose(keep,fcn);
    }

    //23- (void)      askForPermission;
    static askForPermission() {
        if (window.Settings.enableLog)
            WebUtils.log("Web.askForPermission()");
        RecordSound.askForPermission();
    }

    //24- (NSString *)scratchjr_cameracheck
    static scratchjr_cameracheck() {
        WebUtils.log("scratchjr_cameracheck()");
    }

    //25- (NSString *)scratchjr_startfeed:(NSString *)str;
    static scratchjr_startfeed(str) {
        WebUtils.log("scratchjr_startfeed({0})".format(str));
    }

    //26- (NSString *)scratchjr_stopfeed;
    static scratchjr_stopfeed() {
        WebUtils.log("scratchjr_stopfeed()");
    }

    //27- (NSString *)scratchjr_choosecamera:(NSString *)body;
    static scratchjr_choosecamera(body) {
        WebUtils.log("Web.scratchjr_choosecamera({0})".format(body));
    }

    //28- (NSString *)scratchjr_captureimage:(NSString *)onCameraCaptureComplete;
    static scratchjr_captureimage(onCameraCaptureComplete) {
        WebUtils.log("Web.scratchjr_captureimage({0})".format(onCameraCaptureComplete));
    }

    //29- (NSString *)hideSplash:(NSString *)body;
    static hideSplash(body) {
        WebUtils.log("Web.hideSplash({0})".format(body));
    }

    //30- (NSString *)sendSjrUsingShareDialog:(NSString *)fileName
    //                                 :(NSString *)emailSubject
    //                                 :(NSString *)emailBody
    //                                 :(int)shareType
    //                                 :(NSString *)b64data;
    static sendSjrUsingShareDialog(fileName, emailSubject, emailBody, shareType, b64data) {
        WebUtils.log("Web.sendSjrUsingShareDialog({0},{1},{2},{3},{4})".format(fileName, emailSubject, emailBody, shareType, b64data));
    }

    //31- (NSString *)deviceName;
    static deviceName() {
        let strName = "wangzongjun";
        WebUtils.log("Web.deviceName() - (0)".format(strName));
        return strName
    }

    //32- (NSString *)analyticsEvent:(NSString *)category :(NSString *)action :(NSString *)label;
    static analyticsEvent(category, action, label) {
        WebUtils.log("Web.analyticsEvent({0},{1},{2})".format(category, action, label));
    }

    //33- (void)       setAnalyticsPlacePref:(NSString *)place;
    static setAnalyticsPlacePref(place) {
        WebUtils.log("Web.setAnalyticsPlacePref({0})".format(place));
    }
}
