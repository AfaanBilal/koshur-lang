#
# Highest Common Factor (HCF)
# Also known as Greatest Common Divisor (GCD)
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

hcf = banav(a, b) {
    yeli b == 0 {
        a;
    } nate {
        hcf(b, a % b);
    };
};

wan(hcf(10, 5));
wan(hcf(7, 49));
wan(hcf(19, 11));
wan(hcf(24, 18));
