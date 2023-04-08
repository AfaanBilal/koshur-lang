/**
 * Koshur - A simple programming language inspired by the Kashmiri language (Koshur)
 *
 * @author  Afaan Bilal
 * @link    https://afaan.dev
 * @link    https://github.com/AfaanBilal/koshur-lang
 * @license MIT
 */

import fs from "fs";
import { TokenStream } from "./koshur/lexer.js";
import { parse } from "./koshur/parser.js";
import { InputStream } from "./koshur/input.js";
import { Environment, evaluate } from "./koshur/evaluator.js";

var gE = new Environment();

gE.def("time", function (func) {
    try {
        console.time("time");
        return func();
    } finally {
        console.timeEnd("time");
    }
});

gE.def("wan", (...v) => console.log(...v));

const file = process.argv[process.argv.length - 1];
const printAst = process.argv.includes("--print-ast");
const writeAst = process.argv.includes("--write-ast");
const fromAst = process.argv.includes("--from-ast");

if (!file.endsWith(".k") && !(file.endsWith(".ast") && fromAst)) {
    console.error("Usage: node koshur.js [--print-ast] [--write-ast] [--from-ast] <filename>");
    process.exit(1);
}

fs.readFile(file, "utf8", function (err, code) {
    if (err) {
        console.error("Could not open file: %s", err); process.exit(1);
    }

    let ast = fromAst ? JSON.parse(code) : parse(TokenStream(InputStream(code)));

    if (printAst) {
        console.log(JSON.stringify(ast, null, 4));
    }

    if (writeAst) {
        fs.writeFileSync(file.replace(".k", ".ast"), JSON.stringify(ast, null, 4));
    }

    evaluate(ast, gE);
});
