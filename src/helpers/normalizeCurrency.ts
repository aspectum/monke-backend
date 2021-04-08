interface CurrencySymbolTable {
    [key: string]: string;
}

const getSymbolFromISO = (currency: string) => {
    const currencySymbol: CurrencySymbolTable = {
        BRL: 'R$',
        CAD: '$',
        MXN: '$',
        USD: '$',
        CNY: '¥',
        INR: '₹',
        JPY: '¥',
        SGD: '$',
        TRY: '₺',
        AED: 'د.إ',
        SAR: '﷼',
        EUR: '€',
        PLN: 'zł',
        GBP: '£',
        AUD: '$',
    };

    return currencySymbol[currency];
};

// value(string) with cents
export const normalizeCurrency = (value: string | number, currency = 'USD') => {
    const symbol = getSymbolFromISO(currency);

    let numText: string;
    let numFloat: number;

    if (typeof value === 'string') {
        const numArray = value.match(/[0-9]+/g);

        if (!numArray) {
            // return { text: `${symbol} 0.00`, val: '0' };
            return { formatted: `${symbol} ${0.0}`, value: 0, text: '0.00' };
        }

        const numString = numArray.join('');
        numFloat = +numString / 100;
        numText = numFloat.toFixed(2);
    } else {
        numFloat = value;
        numText = numFloat.toFixed(2);
    }

    return { formatted: `${symbol} ${numText}`, value: numFloat, text: numText };
};
