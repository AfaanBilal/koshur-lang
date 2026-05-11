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
        this.vars = parent ? { ...parent.vars } : {};
        this.parent = parent;
    }

    extend() {
        return new Environment(this);
    }

    lookup(name) {
        let scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) return scope;
            scope = scope.parent;
        }
    }

    get(name) {
        if (name in this.vars) return this.vars[name];
        throw new Error(`Undefined variable ${name}`);
    }

    set(name, value) {
        const scope = this.lookup(name);
        if (!scope && this.parent) throw new Error(`Undefined variable ${name}`);
        return (scope || this).vars[name] = value;
    }

    def(name, value) {
        return this.vars[name] = value;
    }
}

const memoCache = new Map();

export function evaluate(exp, env) {
    switch (exp.type) {
        case NodeType.Number:
        case NodeType.String:
        case NodeType.Boolean:
            return exp.value;

        case NodeType.Variable:
            return env.get(exp.value);

        case NodeType.Assignment:
            if (exp.left.type !== NodeType.Variable) throw new Error(`Cannot assign to ${JSON.stringify(exp.left)}`);
            return env.set(exp.left.value, evaluate(exp.right, env));

        case NodeType.Binary:
            const left = evaluate(exp.left, env);
            const right = evaluate(exp.right, env);
            return applyOp(exp.operator, left, right);

        case NodeType.Lambda:
            return makeLambda(env, exp);

        case NodeType.Condition:
            const cond = evaluate(exp.cond, env);
            if (cond !== false) return evaluate(exp.then, env);
            return exp.else ? evaluate(exp.else, env) : false;

        case NodeType.Program:
            let val = false;
            for (const subExp of exp.program) {
                val = evaluate(subExp, env);
            }
            return val;

        case NodeType.Call:
            const func = evaluate(exp.func, env);
            return func(...exp.args.map(arg => evaluate(arg, env)));

        default:
            throw new Error(`I don't know how to evaluate ${exp.type}`);
    }
}

function applyOp(op, a, b) {
    const numA = num(a);
    const numB = num(b);

    switch (op) {
        case "+": return numA + numB;
        case "-": return numA - numB;
        case "*": return numA * numB;
        case "/": return numA / div(numB);
        case "%": return numA % div(numB);
        case "&&": return a !== false && b;
        case "||": return a !== false ? a : b;
        case "<": return numA < numB;
        case ">": return numA > numB;
        case "<=": return numA <= numB;
        case ">=": return numA >= numB;
        case "==": return a === b;
        case "!=": return a !== b;
    }

    throw new Error(`Unknown operator ${op}`);
}

function num(x) {
    if (typeof x !== "number") throw new Error(`Expected number but got ${x}`);
    return x;
}

function div(x) {
    if (num(x) === 0) throw new Error("Division by zero");
    return x;
}

function makeLambda(env, exp) {
    const cacheKey = JSON.stringify(exp);
    if (memoCache.has(cacheKey)) return memoCache.get(cacheKey);

    function lambda() {
        var names = exp.vars;
        var scope = env.extend();

        for (var i = 0; i < names.length; ++i) {
            scope.def(names[i], i < arguments.length ? arguments[i] : false);
        }

        return evaluate(exp.body, scope);
    }
    memoCache.set(cacheKey, lambda);
    return lambda;
}
