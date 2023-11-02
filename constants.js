"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.DEFAULT_SUCCESS_MESSAGE = exports.DEFAULT_NOT_FOUND_MESSAGE = exports.DEFAULT_ERROR_MESSAGE = exports.DEFAULT_MESSAGE_HEADERS = void 0;
exports.DEFAULT_MESSAGE_HEADERS = { 'Content-Type': 'application/json' };
exports.DEFAULT_ERROR_MESSAGE = { status: 500, message: 'Internal Server Error' };
exports.DEFAULT_NOT_FOUND_MESSAGE = { status: 404, message: 'Not Found' };
exports.DEFAULT_SUCCESS_MESSAGE = { status: 200, message: 'Success!' };
exports.PORT = process.env.PORT || 3000;
exports.default = {
    DEFAULT_ERROR_MESSAGE: exports.DEFAULT_ERROR_MESSAGE,
    DEFAULT_MESSAGE_HEADERS: exports.DEFAULT_MESSAGE_HEADERS,
    DEFAULT_NOT_FOUND_MESSAGE: exports.DEFAULT_NOT_FOUND_MESSAGE,
    DEFAULT_SUCCESS_MESSAGE: exports.DEFAULT_SUCCESS_MESSAGE,
    PORT: exports.PORT
};
