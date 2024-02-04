#
# Prime Numbers
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

yiChaPrime = banav(n, d) {
    yeli d == apuz {
        yiChaPrime(n, 2);
    } nate yeli d > n / 2 {
        poz;
    } nate {
        yeli n % d == 0 {
            apuz;
        } nate {
            yiChaPrime(n, d + 1);
        };
    };
};

yeli yiChaPrime(73) {
    wan("Aa,", 73, "chu prime!");
} nate {
    wan("Na sa!", 73, "chu ne prime!");
};

yeli yiChaPrime(93) {
    wan("Aa,", 93, "chu prime!");
} nate {
    wan("Na sa!", 93, "chu ne prime!");
};
