/**
 * Koshur - A simple programming language inspired by the Kashmiri language (Koshur)
 *
 * @author  Afaan Bilal
 * @link    https://afaan.dev
 * @link    https://github.com/AfaanBilal/koshur-lang
 * @license MIT
 */

export const NodeType = {
    Program: "program",
    Assignment: "assignment",
    Binary: "binary",
    Condition: "condition",
    Punctuation: "punctuation",
    Keyword: "kw",
    Operator: "op",
    Variable: "var",
    Number: "number",
    String: "string",
    Boolean: "bool",
    Lambda: "lambda",
    Call: "call",
};

var FALSE = { type: NodeType.Boolean, value: false };

export function parse(input) {
    var PRECEDENCE = {
        "=": 1,
        "||": 2,
        "&&": 3,
        "<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
    };

    return parse_toplevel();

    function is_punctuation(ch) {
        var tok = input.peek();
        return tok && tok.type == NodeType.Punctuation && (!ch || tok.value == ch) && tok;
    }

    function is_kw(kw) {
        var tok = input.peek();
        return tok && tok.type == NodeType.Keyword && (!kw || tok.value == kw) && tok;
    }

    function is_op(op) {
        var tok = input.peek();
        return tok && tok.type == NodeType.Operator && (!op || tok.value == op) && tok;
    }

    function skip_punctuation(ch) {
        if (is_punctuation(ch)) input.next();
        else input.err("Expecting punctuation: \"" + ch + "\"");
    }

    function skip_kw(kw) {
        if (is_kw(kw)) input.next();
        else input.err("Expecting keyword: \"" + kw + "\"");
    }

    function skip_op(op) {
        if (is_op(op)) input.next();
        else input.err("Expecting operator: \"" + op + "\"");
    }

    function unexpected() {
        input.err("Unexpected token: " + JSON.stringify(input.peek()));
    }

    function maybe_binary(left, my_prec) {
        var tok = is_op();

        if (tok) {
            var his_prec = PRECEDENCE[tok.value];

            if (his_prec > my_prec) {
                input.next();
                return maybe_binary({
                    type: tok.value == "=" ? NodeType.Assignment : NodeType.Binary,
                    operator: tok.value,
                    left: left,
                    right: maybe_binary(parse_atom(), his_prec)
                }, my_prec);
            }
        }

        return left;
    }

    function delimited(start, stop, separator, parser) {
        var a = [], first = true;

        skip_punctuation(start);

        while (!input.eof()) {
            if (is_punctuation(stop)) break;
            if (first) first = false; else skip_punctuation(separator);
            if (is_punctuation(stop)) break;

            a.push(parser());
        }

        skip_punctuation(stop);

        return a;
    }

    function parse_call(func) {
        return {
            type: NodeType.Call,
            func: func,
            args: delimited("(", ")", ",", parse_expression),
        };
    }

    function parse_varname() {
        var name = input.next();
        if (name.type != NodeType.Variable) input.err("Expecting variable name");
        return name.value;
    }

    function parse_if() {
        skip_kw("yeli");
        var cond = parse_expression();
        if (!is_punctuation("{")) skip_kw("teli");

        var then = parse_expression();

        var ret = {
            type: NodeType.Condition,
            cond,
            then,
        };

        if (is_kw("nate")) {
            input.next();
            ret.else = parse_expression();
        }

        return ret;
    }

    function parse_lambda() {
        return {
            type: NodeType.Lambda,
            vars: delimited("(", ")", ",", parse_varname),
            body: parse_expression()
        };
    }

    function parse_bool() {
        return {
            type: NodeType.Boolean,
            value: input.next().value == "poz"
        };
    }

    function maybe_call(expr) {
        expr = expr();
        return is_punctuation("(") ? parse_call(expr) : expr;
    }

    function parse_atom() {
        return maybe_call(function () {
            if (is_punctuation("(")) {
                input.next();
                var exp = parse_expression();
                skip_punctuation(")");
                return exp;
            }

            if (is_punctuation("{")) return parse_prog();
            if (is_kw("yeli")) return parse_if();
            if (is_kw("poz") || is_kw("apuz")) return parse_bool();
            if (is_kw("banav") || is_kw("λ")) {
                input.next();
                return parse_lambda();
            }

            var tok = input.next();
            if (tok.type == NodeType.Variable || tok.type == NodeType.Number || tok.type == NodeType.String)
                return tok;
            unexpected();
        });
    }

    function parse_toplevel() {
        var prog = [];

        while (!input.eof()) {
            prog.push(parse_expression());
            if (!input.eof()) skip_punctuation(";");
        }

        return { type: NodeType.Program, prog };
    }

    function parse_prog() {
        var prog = delimited("{", "}", ";", parse_expression);
        if (prog.length == 0) return FALSE;
        if (prog.length == 1) return prog[0];
        return { type: NodeType.Program, prog };
    }

    function parse_expression() {
        return maybe_call(() => maybe_binary(parse_atom(), 0));
    }
}
