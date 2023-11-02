"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const write_json_1 = __importDefault(require("./write_json"));
const http_1 = __importDefault(require("http"));
const k = __importStar(require("./constants"));
const get_filenames_1 = __importDefault(require("./get_filenames"));
const fix_resume_json_1 = __importDefault(require("./fix_resume_json"));
function handleResponse(response, res) {
    var _a;
    res.writeHead((_a = response.status) !== null && _a !== void 0 ? _a : 404, k.DEFAULT_MESSAGE_HEADERS);
    switch (response.status) {
        case 500:
            res.end(JSON.stringify(response !== null && response !== void 0 ? response : k.DEFAULT_ERROR_MESSAGE));
            break;
        case 200:
        case 201:
            res.end(JSON.stringify(response !== null && response !== void 0 ? response : k.DEFAULT_SUCCESS_MESSAGE));
            break;
        default:
            res.end(JSON.stringify(k.DEFAULT_NOT_FOUND_MESSAGE));
    }
}
function handlePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        switch (req.url) {
            case '/write': {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    const result = yield (0, write_json_1.default)('example.json', body);
                    if (result) {
                        response = { status: result.status, message: 'Data written successfully!' };
                    }
                    handleResponse(response, res);
                }));
                break;
            }
            case '/fix-resume-json': {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const requestBody = JSON.parse(body);
                        const result = yield (0, fix_resume_json_1.default)(requestBody.path);
                        if (result)
                            response = result;
                        handleResponse(response, res);
                    }
                    catch (error) {
                        const filenamesResult = yield (0, get_filenames_1.default)();
                        if (!filenamesResult)
                            handleResponse(response, res);
                        const filenames = filenamesResult.body.filenames;
                        for (const name of filenames) {
                            yield (0, fix_resume_json_1.default)(name);
                        }
                        response = { status: 201, message: `Fixing of resume jsons was successful! Check the 'annotations-fixed' folder!` };
                        handleResponse(response, res);
                    }
                }));
                break;
            }
            default:
                response = { status: 404 };
                handleResponse(response, res);
        }
    });
}
function handleGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        switch (req.url) {
            case '/filenames': {
                const result = yield (0, get_filenames_1.default)();
                if (result)
                    response = result;
                handleResponse(response, res);
                break;
            }
            default:
                response = { status: 404 };
                handleResponse(response, res);
        }
    });
}
const server = http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    switch (req.method) {
        case 'POST':
            handlePost(req, res);
            break;
        case 'GET':
            handleGet(req, res);
            break;
        default:
            res.writeHead(404, k.DEFAULT_MESSAGE_HEADERS);
            res.end(k.DEFAULT_ERROR_MESSAGE);
    }
}));
server.listen(k.PORT, () => {
    console.log(`Server running on http://localhost:${k.PORT}`);
});
