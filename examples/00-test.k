#
# Test
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

# This is a comment

wan("Hello!");

x = 10;
y = 20;

wan(x); # Prints 10
wan(y); # Prints 20

yeli poz {
    wan("Poz chu!");
} nate {
    wan("Apuz hasa!");
};

yeli apuz teli
    wan("apuz!")
nate
    wan("poz!");

bod-kus = banav(x, y) yeli x > y teli x nate y;

wan(bod-kus(10, 20)); # Prints 20

# Shortcut for banav is λ

lakut-kus = λ(x, y) yeli x < y teli x nate y;

wan(lakut-kus(10, 20)); # Prints 10

wan("x =", x, "y =", y);

wansaDaleel = banav(n, i) {
    yeli i == apuz {
        wan("Boz sa daleel asel paeth!");
        wansaDaleel(n, 1);
    } nate yeli i <= n {
        wan("Ye hasa daleel number", i);
        wansaDaleel(n, i + 1);
    } nate {
        wan("Bas, yuti ous!");
    };
};

wansaDaleel(5);
