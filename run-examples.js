/**
 * Koshur - A simple programming language inspired by the Kashmiri language (Koshur)
 *
 * @author  Afaan Bilal
 * @link    https://afaan.dev
 * @link    https://github.com/AfaanBilal/koshur-lang
 * @license MIT
 */

import fs from "fs";
import { parse } from "./koshur/parser.js";
import { TokenStream } from "./koshur/lexer.js";
import { InputStream } from "./koshur/input.js";
import { Environment, evaluate } from "./koshur/evaluator.js";

var gE = new Environment();
gE.def("wan", (...v) => console.log(...v));

fs.readdirSync("examples").forEach(file => {
    file.endsWith(".k") && fs.readFile("examples/" + file, "utf8", function (err, code) {
        console.log("Running example: ", file);

        if (err) {
            console.error("Could not open file: %s", err); process.exit(1);
        }

        var ast = parse(TokenStream(InputStream(code)));
        evaluate(ast, gE);

        console.log();
    });
});
