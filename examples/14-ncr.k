#
#
# nCr
# Number of combinations when choosing r elements out of n.
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

factorial = banav(n) {
    yeli n < 0 {
        0;
    } nate yeli n == 0 {
        1;
    } nate {
        n * factorial(n - 1);
    };
};

nCr = banav(n, r) {
    factorial(n) / (factorial(n - r) * factorial(r));
};

wan(nCr(5, 2));
wan(nCr(8, 3));
