/**
 * Koshur - A simple programming language inspired by the Kashmiri language (Koshur)
 *
 * @author  Afaan Bilal
 * @link    https://afaan.dev
 * @link    https://github.com/AfaanBilal/koshur-lang
 * @license MIT
 */

import { NodeType } from "./parser.js";

export function TokenStream(input) {
    var current = null;
    var keywords = " yeli teli nate banav λ poz apuz ";

    return {
        next,
        peek,
        eof,
        err: input.err
    };

    function isKeyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }

    function isDigit(ch) {
        return /[0-9]/i.test(ch);
    }

    function isIdStart(ch) {
        return /[a-zλ_]/i.test(ch);
    }

    function isId(ch) {
        return isIdStart(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
    }

    function isOpChar(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }

    function isPunctuation(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }

    function isWhitespace(ch) {
        return " \t\n\r".indexOf(ch) >= 0;
    }

    function readWhile(predicate) {
        var str = "";

        while (!input.eof() && predicate(input.peek())) {
            str += input.next();
        }

        return str;
    }

    function readNumber() {
        var has_dot = false;

        var number = readWhile(ch => {
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }

            return isDigit(ch);
        });

        return { type: NodeType.Number, value: parseFloat(number) };
    }

    function readIdent() {
        var id = readWhile(isId);

        return {
            type: isKeyword(id) ? NodeType.Keyword : NodeType.Variable,
            value: id
        };
    }

    function readEscaped(end) {
        var escaped = false, str = "";

        input.next();
        while (!input.eof()) {
            var ch = input.next();

            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }
        }

        return str;
    }

    function readString() {
        return { type: NodeType.String, value: readEscaped('"') };
    }

    function skipComment() {
        readWhile(ch => ch != "\n");
        input.next();
    }

    function readNext() {
        readWhile(isWhitespace);

        if (input.eof()) return null;

        var c = input.peek();

        if (c == "#") {
            skipComment();
            return readNext();
        }

        if (c == '"') return readString();

        if (isDigit(c)) return readNumber();

        if (isIdStart(c)) return readIdent();

        if (isPunctuation(c))
            return {
                type: NodeType.Punctuation,
                value: input.next()
            };

        if (isOpChar(c))
            return {
                type: NodeType.Operator,
                value: readWhile(isOpChar)
            };

        input.err("Can't handle character: " + c);
    }

    function peek() {
        return current || (current = readNext());
    }

    function next() {
        var tok = current;
        current = null;
        return tok || readNext();
    }

    function eof() {
        return peek() == null;
    }
}
