#
# Fibonacci
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

karunPrintFibonacci = banav(hadd, aediuk, patium) {
    yeli (hadd > 0) {
        wan(aediuk + patium);
        karunPrintFibonacci(hadd - 1, patium, aediuk + patium);
    };
};

karunPrintFibonacci(10, 0, 1);
