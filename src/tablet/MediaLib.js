import IO from './IO';
import Localization from '../utils/Localization';

let path;
let samples;
let backgrounds;
let sprites;
let sounds;
let soundspath;
let keys = {};

export default class MediaLib {
    static get path() {
        return path;
    }

    static get samples() {
        return samples;
    }

    static get sprites() {
        return sprites;
    }

    static get backgrounds() {
        return backgrounds;
    }

    static get sounds() {
        return sounds;
    }

    static get soundspath() {
        return soundspath;
    }

    static get keys() {
        return keys;
    }

    static loadMediaLib(root, whenDone) {
        IO.requestFromServerNoCache(root + 'media.json', (result) => {
            let parsedResult = JSON.parse(result);
            path = parsedResult.path;
            samples = parsedResult.samples;
            sprites = parsedResult.sprites;
            backgrounds = parsedResult.backgrounds;
            sounds = parsedResult.sounds;
            soundspath = parsedResult.soundspath;

            MediaLib.localizeMediaNames();
            MediaLib.generateKeys();

            whenDone();
        });
    }

    static localizeMediaNames() {
        // Localize names of sprites
        for (let i = 0; i < sprites.length; i++) {
            if (sprites[i].order != null)
                sprites[i].name = Localization.localize('CHARACTER_' + sprites[i].md5);
        }

        // Localize names of backgrounds
        for (let i = 0; i < backgrounds.length; i++) {
            backgrounds[i].name = Localization.localize('BACKGROUND_' + backgrounds[i].md5);
        }
    }

    static generateKeys() {
        for (let i = 0; i < backgrounds.length; i++) {
            var bg = backgrounds[i];
            keys[bg.md5] = {
                width: bg.width,
                height: bg.height,
                name: bg.name
            };
        }

        for (let i = 0; i < sprites.length; i++) {
            var spr = sprites[i];
            keys[spr.md5] = {
                width: spr.width,
                height: spr.height,
                name: spr.name
            };
        }
    }
}