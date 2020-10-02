import ScratchAudio from '../utils/ScratchAudio';
import WebUtils from './WebUtils';
import RecordSound from './RecordSound'

let soundManager;
// Allow server side rendering
if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
        ({
            soundManager
        } = require('soundmanager2'));
    } else {
        ({
            soundManager
        } = require('soundmanager2/script/soundmanager2-nodebug'));
    }
}

export default class SoundPlayer {
    static init(fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("SoundPlayer.init()");
        soundManager.setup({
            onready: function () {
                if (window.Settings.enableLog)
                    WebUtils.log("soundManager.onready()");
                WebUtils._fcnF(fcn, 0);
            }
        })
    }

    static io_registersound(dir, name, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("SoundPlayer.io_registersound({0},{1})".format(dir, name));
        let pathName = dir + name;
        if (dir == "Documents") {
            RecordSound.loadSound(name,fcn);
        } else {
            pathName = pathName.replace("HTML5/", "");
            if (window.Settings.enableLog)
                WebUtils.log("soundManager.createSound({0},{1})".format(name, pathName));
            let strRe = SoundPlayer._createsound(name, pathName);
            WebUtils._fcnF(fcn, strRe);
        }
    }

    static _createsound(name, url) {
        if (window.Settings.enableLog)
            WebUtils.log("SoundPlayer._createsound({0},{1})".format(name, url));
        soundManager.createSound({
            id: name,
            url: url
        });
        return "{0},{1}".format(name, 1.0);
    }

    static io_playsound(name, fcn) {
        if (window.Settings.enableLog)
            WebUtils.log("SoundPlayer.io_playsound({0})".format(name));
        let soundEnded = function () {
            if (window.Settings.enableLog)
                WebUtils.log("SoundPlayer.io_playsound({0}) - finish.".format(name));
            if (typeof (fcn) !== 'undefined')
                fcn(name);
            else
                ScratchAudio.soundDone(name);
        };
        soundManager.play(name, {
            onfinish: soundEnded
        });
    }

    static io_stopsound(name) {
        if (window.Settings.enableLog)
            WebUtils.log("SoundPlayer.io_stopsound({0})".format(name));
        soundManager.stop(name);
    }
}
