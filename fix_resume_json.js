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
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
function fixResumeJson(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, promises_1.readFile)('./annotations/' + path, { encoding: 'utf8' });
            const json = JSON.parse(response);
            let i = 0;
            while (i < json.form.length) {
                if (i === 0) {
                    i++;
                    continue;
                }
                let current = json.form[i];
                for (let before = 0; before < i; before++) {
                    const startEntry = json.form[before];
                    while (current.box[1] === startEntry.box[1] && current.box[3] === startEntry.box[3]) {
                        for (let k = 0; k < current.words.length; k++) {
                            const currentWords = {
                                "text": current.words[k].text,
                                "box": current.words[k].box
                            };
                            // if the current word entry the iterator is pointing to goes first visually in the image,
                            // then append it to the front of the text and the `words` list of `startEntry`
                            if (current.box[0] < startEntry.box[0]) {
                                startEntry.words.unshift(currentWords);
                                startEntry.text = current.words[k].text + " " + startEntry.text;
                            }
                            else {
                                startEntry.words.push(currentWords);
                                startEntry.text += " " + current.words[k].text;
                            }
                        }
                        // essentially just remove the current element
                        json.form.splice(i, 1);
                        if (i >= json.form.length)
                            break;
                        current = json.form[i];
                    }
                }
                i++;
            }
            yield (0, promises_1.writeFile)('./annotations-fixed/' + path, JSON.stringify(json));
            return { status: 201, message: `Fixing of ${path} was successful! Check the 'annotations-fixed' folder!` };
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    });
}
exports.default = fixResumeJson;
