#
# Reverse a Number
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

khalPoweras = banav(x, n) {
    yeli n == 0 {
        1;
    } nate yeli n == 1 {
        x;
    } nate {
        x * khalPoweras(x, n - 1);
    };
};

ginzrawDigit = banav(n) {
    yeli n < 10 {
        1;
    } nate {
        1 + ginzrawDigit((n - (n % 10)) / 10);
    };
};

karsaReverse = banav(n, i) {
    yeli i == apuz {
        karsaReverse(n, ginzrawDigit(n) - 1);
    } nate yeli n < 10 {
        n;
    } nate {
        khalPoweras(10, i) * (n % 10) + karsaReverse((n - (n % 10)) / 10, i - 1);
    };
};

wan(karsaReverse(123));
wan(karsaReverse(987654321));
