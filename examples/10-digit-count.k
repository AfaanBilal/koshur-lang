#
# Count Digits
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

ginzrawDigit = banav(n) {
    yeli n < 10 {
        1;
    } nate {
        1 + ginzrawDigit((n - (n % 10)) / 10);
    };
};

wan(ginzrawDigit(2));
wan(ginzrawDigit(1234));
