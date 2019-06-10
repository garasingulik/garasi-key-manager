#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var keywrap_1 = __importDefault(require("../lib/keywrap"));
function printUsageAndExit() {
    // tslint:disable-next-line: no-console
    console.log('kstool <command> [options]');
    process.exit(0);
}
function doWrap(args) {
    if (args.length !== 3 || args[0] !== '--kek') {
        // tslint:disable-next-line: no-console
        console.log("invalid arguments for 'wrap' command");
        process.exit(1);
    }
    var kek = args[1];
    var key = args[2];
    var wrapped = keywrap_1.default.wrapKey(key, kek);
    if (wrapped) {
        // tslint:disable-next-line: no-console
        console.log(wrapped.toString('hex'));
    }
}
function doUnwrap(args) {
    if (args.length !== 3 || args[0] !== '--kek') {
        // tslint:disable-next-line: no-console
        console.log("invalid arguments for 'unwrap' command");
        process.exit(1);
    }
    var kek = args[1];
    var ek = args[2];
    var unwrapped = keywrap_1.default.unwrapKey(ek, kek);
    if (!unwrapped) {
        // tslint:disable-next-line: no-console
        console.log('ERROR: cannot unwrap key');
        process.exit(1);
        return;
    }
    // tslint:disable-next-line: no-console
    console.log(unwrapped.toString('hex'));
}
if (process.argv.length < 3) {
    printUsageAndExit();
}
var command = process.argv[2];
switch (command) {
    case 'wrap':
        doWrap(process.argv.slice(3));
        break;
    case 'unwrap':
        doUnwrap(process.argv.slice(3));
        break;
    default:
        // tslint:disable-next-line: no-console
        console.log('unknown command');
}
