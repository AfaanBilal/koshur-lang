#
# Raise to Power
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

wan(khalPoweras(10, 3));
wan(khalPoweras(2, 10));
