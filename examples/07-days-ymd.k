#
# Days to Years, Months, Days (approx)
#
# Koshur lang (https://github.com/AfaanBilal/koshur-lang)
#

numDays = 1080;

days = (numDays % 365) % 30;
months = ((numDays - days) % 365) / 30;
years = (numDays - days - 30 * months) / 365;

wan(numDays, "days are", years, "years", months, "months", days, "days.");
