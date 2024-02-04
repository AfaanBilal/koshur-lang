#
# Factors
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

factors = banav(n, i) {
    yeli i == apuz {
        factors(n, 1);
    } nate yeli i <= n / 2 {
        yeli n % i == 0 {
            wan(i);
        };

        factors(n, i + 1);
    };
};

wan("Factors of 10: ");
factors(10);

wan("Factors of 49: ");
factors(49);
