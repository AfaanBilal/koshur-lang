/**
 * Koshur - A simple programming language inspired by the Kashmiri language (Koshur)
 *
 * @author  Afaan Bilal
 * @link    https://afaan.dev
 * @link    https://github.com/AfaanBilal/koshur-lang
 * @license MIT
 */

import { NodeType } from "./parser.js";

export class Environment {
    constructor(parent) {
        this.vars = Object.create(parent ? parent.vars : null);
        this.parent = parent;
    }

    extend() {
        return new Environment(this);
    }

    lookup(name) {
        var scope = this;

        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name))
                return scope;

            scope = scope.parent;
        }
    }

    get(name) {
        if (name in this.vars)
            return this.vars[name];

        throw new Error("Undefined variable " + name);
    }

    set(name, value) {
        var scope = this.lookup(name);

        if (!scope && this.parent)
            throw new Error("Undefined variable " + name);

        return (scope || this).vars[name] = value;
    }

    def(name, value) {
        return this.vars[name] = value;
    }
}

export function evaluate(exp, env) {
    switch (exp.type) {
        case NodeType.Number:
        case NodeType.String:
        case NodeType.Boolean:
            return exp.value;

        case NodeType.Variable:
            return env.get(exp.value);

        case NodeType.Assignment:
            if (exp.left.type != NodeType.Variable)
                throw new Error("Cannot assign to " + JSON.stringify(exp.left));
            return env.set(exp.left.value, evaluate(exp.right, env));

        case NodeType.Binary:
            return apply_op(exp.operator,
                evaluate(exp.left, env),
                evaluate(exp.right, env));

        case NodeType.Lambda:
            return make_lambda(env, exp);

        case NodeType.Condition:
            var cond = evaluate(exp.cond, env);
            if (cond !== false) return evaluate(exp.then, env);
            return exp.else ? evaluate(exp.else, env) : false;

        case NodeType.Program:
            var val = false;
            exp.program.forEach(exp => { val = evaluate(exp, env) });
            return val;

        case NodeType.Call:
            var func = evaluate(exp.func, env);
            return func.apply(null, exp.args.map(arg => evaluate(arg, env)));

        default:
            throw new Error("I don't know how to evaluate " + exp.type);
    }
}

function apply_op(op, a, b) {
    function num(x) {
        if (typeof x != "number")
            throw new Error("Expected number but got " + x);
        return x;
    }

    function div(x) {
        if (num(x) == 0)
            throw new Error("Division by zero");
        return x;
    }

    switch (op) {
        case "+": return num(a) + num(b);
        case "-": return num(a) - num(b);
        case "*": return num(a) * num(b);
        case "/": return num(a) / div(b);
        case "%": return num(a) % div(b);
        case "&&": return a !== false && b;
        case "||": return a !== false ? a : b;
        case "<": return num(a) < num(b);
        case ">": return num(a) > num(b);
        case "<=": return num(a) <= num(b);
        case ">=": return num(a) >= num(b);
        case "==": return a === b;
        case "!=": return a !== b;
    }

    throw new Error("Unknown operator " + op);
}

function make_lambda(env, exp) {
    function lambda() {
        var names = exp.vars;
        var scope = env.extend();

        for (var i = 0; i < names.length; ++i) {
            scope.def(names[i], i < arguments.length ? arguments[i] : false);
        }

        return evaluate(exp.body, scope);
    }

    return lambda;
}
