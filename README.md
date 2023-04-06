🍁 koshur-lang
===============

A simple programming language inspired by the Kashmiri language (Koshur)

---

### **Author**: [Afaan Bilal](https://afaan.dev)

---

## Hello World
````
wan("Hello, world!");
````

---
## Run
````
node koshur.js <filename>
````

The `filename` must be the last parameter and must end with `.k`.

```
node koshur.js [--print-ast] [--write-ast] <filename>
```
- Add `--print-ast` to print the Abstract Syntax Tree.
- Add `--write-ast` to write the Abstract Syntax Tree to a file named `filename` with extension set to `.ast`.

---

## Run examples
See examples in the `examples/` directory.

````
node run-examples.js
````

---

## Syntax

Koshur-lang has a very brief syntax. Semi-colons are required except after expressions.

### Comments
```
# This is a comment
```

### Print to screen
```
wan("Hello!");
```

### Variables
```
x = 10;
y = 20;

wan(x); # Prints 10
wan(y); # Prints 20
```

### Control flow
- `poz` means `true`
- `apuz` means `false`
- `yeli` means `if`
- `nate` means `else`
- `teli` means `then` and is only required after `if` when braces (`{}`) are skipped.

```
yeli poz {
    wan("Poz chu!");
} nate {
    wan("Apuz hasa!");
};

yeli apuz teli
    wan("apuz!")
nate
    wan("poz!");
```

### Functions
Functions in **koshur-lang** are lambdas.
```
bod-kus = banav(x, y) yeli x > y teli x nate y;

wan(bod-kus(10, 20)); # Prints 20
```
This creates a function (lambda) named `bod-kus` which returns the bigger of the two parameters.


```
# Shortcut for banav is λ

lakut-kus = λ(x, y) yeli x < y teli x nate y;

wan(lakut-kus(10, 20)); # Prints 10
```
This creates a function (lambda) named `lakut-kus` which returns the smaller of the two parameters.

### Keywords
This is a list of all the keywords in **koshur-lang**.

- yeli
- teli
- nate
- poz
- apuz
- banav
- λ

---

## Contributing
All contributions are welcome. Please create an issue first for any feature request
or bug. Then fork the repository, create a branch and make any changes to fix the bug
or add the feature and create a pull request. That's it!
Thanks!

---

## License
**koshur-lang** is released under the MIT License.
Check out the full license [here](LICENSE).
