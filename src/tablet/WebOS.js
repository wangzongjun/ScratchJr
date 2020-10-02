import Web from './Web';

let camera;
let mediacounter = 0;
let tabletInterface = null;

export default class WebOS {
    static init() {
        Web.init();
        tabletInterface = Web;
        if (fcn) {
            fcn();
        }
    }

    static stmt(json, fcn) {
        tabletInterface.database_stmt(JSON.stringify(json), fcn);
    }

    static query(json, fcn) {
        tabletInterface.database_query(JSON.stringify(json), fcn);
    }

    // IO functions
    static cleanassets(ft, fcn) {
        tabletInterface.io_cleanassets(ft, fcn);
    }

    static getmedia(file, fcn) {
        mediacounter++;
        var nextStep = function (file, key, whenDone) {
            tabletInterface.io_getmedialen(file, key, function (result) {
                WebOS.processdata(key, 0, result, '', whenDone);
            });
        };
        nextStep(file, mediacounter, fcn);
    }

    static getmediadata(key, offset, len, fcn) {
        tabletInterface.io_getmediadata(key, offset, len, fcn);
    }

    static processdata(key, off, len, oldstr, fcn) {
        if (len == 0) {
            WebOS.getmediadone(key);
            fcn(oldstr);
            return;
        }
        var newlen = (len < 100000) ? len : 100000;
        WebOS.getmediadata(key, off, newlen, function (str) {
            WebOS.processdata(key, off + newlen, len - newlen, oldstr + str, fcn);
        });
    }

    static getsettings(fcn) {
        var result = tabletInterface.io_getsettings();
        if (fcn) {
            fcn(result);
        }
    }

    static getmediadone(file, fcn) {
        tabletInterface.io_getmediadone(file, fcn);
    }

    static setmedia(str, ext, fcn) {
        tabletInterface.io_setmedia(str, ext, fcn);
    }

    static setmedianame(str, name, ext, fcn) {
        tabletInterface.io_setmedianame(str, name, ext, fcn);
    }

    static getmd5(str, fcn) {
        var result = tabletInterface.io_getmd5(str);
        if (fcn) {
            fcn(result);
        }
    }

    static remove(str, fcn) {
        tabletInterface.io_remove(str, fcn);
    }

    static getfile(str, fcn) {
        tabletInterface.io_getfile(str, fcn);
    }

    static setfile(name, str, fcn) {
        tabletInterface.io_setfile(name, btoa(str), fcn);
    }

    // Sound functions
    static registerSound(dir, name, fcn) {
        tabletInterface.io_registersound(dir, name, fcn);
    }

    static playSound(name, fcn) {
        var result = tabletInterface.io_playsound(name);
        if (fcn) {
            fcn(result);
        }
    }

    static stopSound(name, fcn) {
        var result = tabletInterface.io_stopsound(name);
        if (fcn) {
            fcn(result);
        }
    }

    static sndrecord(fcn) {
        tabletInterface.recordsound_recordstart(fcn);
    }

    static recordstop(fcn) {
        tabletInterface.recordsound_recordstop(fcn);
    }

    static volume(fcn) {
        tabletInterface.recordsound_volume(fcn);
    }

    static startplay(fcn) {
        tabletInterface.recordsound_startplay(fcn);
    }

    static stopplay(fcn) {
        tabletInterface.recordsound_stopplay(fcn);
    }

    static recorddisappear(b, fcn) {
        tabletInterface.recordsound_recordclose(b, fcn);
    }

    // Record state
    static askpermission() {
        tabletInterface.askForPermission();
    }

    // camera functions
    static hascamera() {
        camera = tabletInterface.scratchjr_cameracheck();
    }

    static startfeed(data, fcn) {
        var str = JSON.stringify(data);
        var result = tabletInterface.scratchjr_startfeed(str);
        if (fcn) {
            fcn(result);
        }
    }

    static stopfeed(fcn) {
        var result = tabletInterface.scratchjr_stopfeed();
        if (fcn) {
            fcn(result);
        }
    }

    static choosecamera(mode, fcn) {
        var result = tabletInterface.scratchjr_choosecamera(mode);
        if (fcn) {
            fcn(result);
        }
    }

    static captureimage(fcn) {
        tabletInterface.scratchjr_captureimage(fcn);
    }

    static hidesplash(fcn) {
        tabletInterface.hideSplash();
        if (fcn) {
            fcn();
        }
    }

    static trace(str) {
        WebUtils.log(str); // eslint-disable-line no-console
    }

    static parse(str) {
        WebUtils.log(JSON.parse(str)); // eslint-disable-line no-console
    }

    static tracemedia(str) {
        WebUtils.log(atob(str)); // eslint-disable-line no-console
    }

    ignore() {}

    ///////////////
    // Sharing
    ///////////////
    // Called on the JS side to trigger native UI for project sharing.
    // fileName: name for the file to share
    // emailSubject: subject text to use for an email
    // emailBody: body HTML to use for an email
    // shareType: 0 for Email; 1 for Airdrop
    // b64data: base-64 encoded .SJR file to share
    static sendSjrToShareDialog(fileName, emailSubject, emailBody, shareType, b64data) {
        tabletInterface.sendSjrUsingShareDialog(fileName, emailSubject, emailBody, shareType, b64data);
    }

    // Name of the device/iPad to display on the sharing dialog page
    // fcn is called with the device name as an arg
    static deviceName(fcn) {
        fcn(tabletInterface.deviceName());
    }

    static analyticsEvent(category, action, label) {
        tabletInterface.analyticsEvent(category, action, label);
    }

    static setAnalyticsPlacePref(preferredPlace) {
        tabletInterface.setAnalyticsPlacePref(preferredPlace);
    }
}
