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
function fixIdJson(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, promises_1.readFile)('./annotations/' + filename, { encoding: 'utf8' });
            const json = JSON.parse(response);
            for (let i = 0; i < json.form.length; i++) {
                json.form[i].id = i;
            }
            yield (0, promises_1.writeFile)('./annotations-fixed/' + filename, JSON.stringify(json));
            return { status: 201, message: `Fixing of ${filename}'s IDs was successful! Check the 'annotations-fixed' folder!` };
        }
        catch (error) {
            return undefined;
        }
    });
}
exports.default = fixIdJson;
