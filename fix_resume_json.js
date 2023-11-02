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
function fixResumeJson(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, promises_1.readFile)('./annotations/' + filename, { encoding: 'utf8' });
            const json = JSON.parse(response);
            // iterate through whole forms list
            let i = 0;
            while (i < json.form.length) {
                if (i === 0) {
                    i++;
                    continue;
                }
                // create reference to currently pointed entry
                let current = json.form[i];
                // loop through all entries that were already iterated over, and see if there are entries that are in the
                // same line as the currently pointed entry.
                // if there is a match, essentially what happens is that the currently pointed entry is appended to the
                // match's words list. 
                let before = 0;
                while (before < i) {
                    // the matched entry
                    const matchedEntry = json.form[before];
                    // determines whether to increment the before counter or not at the end of this inner loop
                    let matchWasChanged = false;
                    // if currently pointed to entry is on the same line as the pointed to start entry, commence re-assigning
                    while (current.box[1] === matchedEntry.box[1] && current.box[3] === matchedEntry.box[3]) {
                        // iterate through the currently pointed entry's words and add them all to the matched entry
                        for (let k = 0; k < current.words.length; k++) {
                            const currentWords = {
                                "text": current.words[k].text,
                                "box": current.words[k].box
                            };
                            matchedEntry.words.push(currentWords);
                        }
                        // sort elements in matched entry, edit its text field accordingly, as well as its x offsets
                        // sort using selection-sort
                        let fullText = '';
                        for (let ki = 0; ki < matchedEntry.words.length; ki++) {
                            let min = matchedEntry.words[ki].box[0];
                            let minIndex = ki;
                            for (let kj = minIndex + 1; kj < matchedEntry.words.length; kj++) {
                                if (matchedEntry.words[kj].box[0] < min) {
                                    min = matchedEntry.words[kj].box[0];
                                    minIndex = kj;
                                }
                            }
                            if (minIndex !== ki) {
                                let temp = matchedEntry.words[minIndex];
                                matchedEntry.words[minIndex] = matchedEntry.words[ki];
                                matchedEntry.words[ki] = temp;
                            }
                            if (ki === matchedEntry.words.length - 1) {
                                fullText += matchedEntry.words[ki].text;
                            }
                            else {
                                fullText += matchedEntry.words[ki].text + ' ';
                            }
                        }
                        // assign the combined text of the words
                        matchedEntry.text = fullText;
                        // re-assign matched entry offsets by minimum and maximum x-offset found in its words list
                        let lastWordIndex = matchedEntry.words.length - 1;
                        matchedEntry.box[0] = matchedEntry.words[0].box[0];
                        matchedEntry.box[2] = matchedEntry.words[lastWordIndex].box[2];
                        // remove the current element AND shift all following elements by 1 down.
                        // the delete operator technically can be used, but doing so doesn't update the list's length, which can
                        // be hard to debug and reason with.
                        json.form.splice(i, 1);
                        if (i >= json.form.length)
                            break;
                        // re-assign current pointed to entry to the next entry.
                        // this might seem like an error, but since we are in a while loop while modifying the list, a lot of
                        // funky things usually happen. Fortunately for Javascript, removing an element in a list while iterating
                        // over it is simple compared to other environments, but that still doesn't eliminate the innate funkiness
                        // of the act.
                        // suppose you have a 3-element list, and you are iterating over it. you're currently on the second (1)
                        // element and you decided you want to remove it. Logically speaking, if you indeed remove the element
                        // from the list, the number of elements in the list decreases and all the elements that came after will
                        // then adjust their order, in other words, their index.
                        // that would explain why we're not incrementing our `i` here, since we are pointing to the next element
                        // after all.
                        current = json.form[i];
                        // finally, reset the before counter, since we're pointing to a new entry now
                        before = 0;
                        matchWasChanged = true;
                    }
                    // this is to prevent skipping over the 0th entry
                    if (matchWasChanged) {
                        matchWasChanged = false;
                    }
                    else {
                        before++;
                    }
                }
                i++;
            }
            yield (0, promises_1.writeFile)('./annotations-fixed/' + filename, JSON.stringify(json));
            return { status: 201, message: `Fixing of ${filename} was successful! Check the 'annotations-fixed' folder!` };
        }
        catch (error) {
            return undefined;
        }
    });
}
exports.default = fixResumeJson;
