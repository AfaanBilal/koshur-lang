#
#
# Linear Curve Fitting
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

a = 0;
b = 0;
sign = "+";

fit = banav(x1, y1, x2, y2) {
    yeli x1 == x2 {
        wan("Hatsa x1 x2 kyazi same? Yim di sa badal.", "x1 =", x1, ", x2 =", x2);
    } nate {
        a = (y1 - y2) / (x1 - x2);
        b = ((x1 * y2) - (y1 * x2)) / (x1 - x2);

        yeli b > 0 {
            sign = "+";
        } nate yeli b < 0 {
            sign = "-";
            b = 0 - b;
        } nate yeli b == 0 {
            sign = "";
            b = "";
        };

        yeli a == 1 {
            a = " ";
        } nate yeli a == 0 - 1 {
            a = "-";
        };

        wan("Rathsa Linear equation: y =", a, "x", sign, b);
    };
};

fit(0, 0, 1, 1);
fit(0, 3, 1, 5);
fit(10, 3, 11, 5);
fit(5, 0-2, 6, 0-3);
fit(0-5, 24, 0-6, 33);
fit(0, 1, 0, 2);
