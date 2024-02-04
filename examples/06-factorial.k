#
# Factorial
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

wan(factorial(3));
wan(factorial(5));
wan(factorial(7));
wan(factorial(10));
