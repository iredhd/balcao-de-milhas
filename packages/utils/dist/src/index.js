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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = exports.formatDateTime = exports.formatDate = exports.formatMoney = void 0;
const currency_js_1 = __importDefault(require("currency.js"));
const moment_1 = __importDefault(require("moment"));
__exportStar(require("./airlines"), exports);
const formatMoney = (value) => {
    return (0, currency_js_1.default)(value).format({
        symbol: 'R$ ',
        decimal: ',',
        separator: '.'
    });
};
exports.formatMoney = formatMoney;
const formatDate = (value) => {
    return (0, moment_1.default)(value).format('DD/MM/YYYY');
};
exports.formatDate = formatDate;
const formatDateTime = (value) => {
    return (0, moment_1.default)(value).format('DD/MM/YYYY HH:mm:ss');
};
exports.formatDateTime = formatDateTime;
const formatNumber = (value) => {
    return Number(value).toLocaleString('pt-BR');
};
exports.formatNumber = formatNumber;
