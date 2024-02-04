#
#
# nPr
# Number of permutations when choosing r elements out of n.
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

nPr = banav(n, r) {
    factorial(n) / factorial(n - r);
};

wan(nPr(5, 2));
wan(nPr(8, 3));
