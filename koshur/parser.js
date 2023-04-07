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

    return parseTopLevel();

    function isPunctuation(ch) {
        var tok = input.peek();
        return tok && tok.type == NodeType.Punctuation && (!ch || tok.value == ch) && tok;
    }

    function isKw(kw) {
        var tok = input.peek();
        return tok && tok.type == NodeType.Keyword && (!kw || tok.value == kw) && tok;
    }

    function isOp(op) {
        var tok = input.peek();
        return tok && tok.type == NodeType.Operator && (!op || tok.value == op) && tok;
    }

    function skipPunctuation(ch) {
        if (isPunctuation(ch)) input.next();
        else input.err("Expecting punctuation: \"" + ch + "\"");
    }

    function skipKw(kw) {
        if (isKw(kw)) input.next();
        else input.err("Expecting keyword: \"" + kw + "\"");
    }

    function skipOp(op) {
        if (isOp(op)) input.next();
        else input.err("Expecting operator: \"" + op + "\"");
    }

    function unexpected() {
        input.err("Unexpected token: " + JSON.stringify(input.peek()));
    }

    function maybeBinary(left, my_prec) {
        var tok = isOp();

        if (tok) {
            var his_prec = PRECEDENCE[tok.value];

            if (his_prec > my_prec) {
                input.next();
                return maybeBinary({
                    type: tok.value == "=" ? NodeType.Assignment : NodeType.Binary,
                    operator: tok.value,
                    left: left,
                    right: maybeBinary(parseAtom(), his_prec)
                }, my_prec);
            }
        }

        return left;
    }

    function delimited(start, stop, separator, parser) {
        var a = [], first = true;

        skipPunctuation(start);

        while (!input.eof()) {
            if (isPunctuation(stop)) break;
            if (first) first = false; else skipPunctuation(separator);
            if (isPunctuation(stop)) break;

            a.push(parser());
        }

        skipPunctuation(stop);

        return a;
    }

    function parseCall(func) {
        return {
            type: NodeType.Call,
            func: func,
            args: delimited("(", ")", ",", parseExpression),
        };
    }

    function parseVarname() {
        var name = input.next();
        if (name.type != NodeType.Variable) input.err("Expecting variable name");
        return name.value;
    }

    function parseIf() {
        skipKw("yeli");
        var cond = parseExpression();
        if (!isPunctuation("{")) skipKw("teli");

        var then = parseExpression();

        var ret = {
            type: NodeType.Condition,
            cond,
            then,
        };

        if (isKw("nate")) {
            input.next();
            ret.else = parseExpression();
        }

        return ret;
    }

    function parseLambda() {
        return {
            type: NodeType.Lambda,
            vars: delimited("(", ")", ",", parseVarname),
            body: parseExpression()
        };
    }

    function parseBool() {
        return {
            type: NodeType.Boolean,
            value: input.next().value == "poz"
        };
    }

    function maybeCall(expr) {
        expr = expr();
        return isPunctuation("(") ? parseCall(expr) : expr;
    }

    function parseAtom() {
        return maybeCall(function () {
            if (isPunctuation("(")) {
                input.next();
                var exp = parseExpression();
                skipPunctuation(")");
                return exp;
            }

            if (isPunctuation("{")) return parseProgram();
            if (isKw("yeli")) return parseIf();
            if (isKw("poz") || isKw("apuz")) return parseBool();
            if (isKw("banav") || isKw("λ")) {
                input.next();
                return parseLambda();
            }

            var tok = input.next();
            if (tok.type == NodeType.Variable || tok.type == NodeType.Number || tok.type == NodeType.String)
                return tok;
            unexpected();
        });
    }

    function parseTopLevel() {
        var program = [];

        while (!input.eof()) {
            program.push(parseExpression());
            if (!input.eof()) skipPunctuation(";");
        }

        return { type: NodeType.Program, program };
    }

    function parseProgram() {
        var program = delimited("{", "}", ";", parseExpression);
        if (program.length == 0) return FALSE;
        if (program.length == 1) return program[0];
        return { type: NodeType.Program, program };
    }

    function parseExpression() {
        return maybeCall(() => maybeBinary(parseAtom(), 0));
    }
}
