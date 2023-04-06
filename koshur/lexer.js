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

    function is_keyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    }

    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    }

    function is_id_start(ch) {
        return /[a-zλ_]/i.test(ch);
    }

    function is_id(ch) {
        return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
    }

    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    }

    function is_punctuation(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    }

    function is_whitespace(ch) {
        return " \t\n\r".indexOf(ch) >= 0;
    }

    function read_while(predicate) {
        var str = "";

        while (!input.eof() && predicate(input.peek())) {
            str += input.next();
        }

        return str;
    }

    function read_number() {
        var has_dot = false;

        var number = read_while(ch => {
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }

            return is_digit(ch);
        });

        return { type: NodeType.Number, value: parseFloat(number) };
    }

    function read_ident() {
        var id = read_while(is_id);

        return {
            type: is_keyword(id) ? NodeType.Keyword : NodeType.Variable,
            value: id
        };
    }

    function read_escaped(end) {
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

    function read_string() {
        return { type: NodeType.String, value: read_escaped('"') };
    }

    function skip_comment() {
        read_while(ch => ch != "\n");
        input.next();
    }

    function read_next() {
        read_while(is_whitespace);

        if (input.eof()) return null;

        var ch = input.peek();

        if (ch == "#") {
            skip_comment();
            return read_next();
        }

        if (ch == '"') return read_string();

        if (is_digit(ch)) return read_number();

        if (is_id_start(ch)) return read_ident();

        if (is_punctuation(ch))
            return {
                type: NodeType.Punctuation,
                value: input.next()
            };

        if (is_op_char(ch))
            return {
                type: NodeType.Operator,
                value: read_while(is_op_char)
            };

        input.err("Can't handle character: " + ch);
    }

    function peek() {
        return current || (current = read_next());
    }

    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }

    function eof() {
        return peek() == null;
    }
}
