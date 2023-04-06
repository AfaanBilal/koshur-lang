/**
 * Koshur - A simple programming language inspired by the Kashmiri language (Koshur)
 *
 * @author  Afaan Bilal
 * @link    https://afaan.dev
 * @link    https://github.com/AfaanBilal/koshur-lang
 * @license MIT
 */

export function InputStream(input) {
    var pos = 0, line = 1, col = 0;

    return {
        next  : next,
        peek  : peek,
        eof   : eof,
        croak : croak,
    };

    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n") line++, col = 0; else col++;
        return ch;
    }

    function peek() {
        return input.charAt(pos);
    }

    function eof() {
        return peek() == "";
    }

    function croak(msg) {
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}
