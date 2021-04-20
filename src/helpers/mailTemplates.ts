import { AlertDocumentPopulatedAll } from '../interfaces';
import { normalizeCurrency } from './normalizeCurrency';

export const alertMail = (alert: AlertDocumentPopulatedAll) => {
    const { title } = alert.product;
    const img = alert.product.imageUrl;
    const targetPrice = normalizeCurrency(alert.targetPrice, alert.product.currency).formatted;
    const currentPrice = normalizeCurrency(
        alert.product.priceHistory[alert.product.priceHistory.length - 1].price,
        alert.product.currency
    ).formatted;
    const link = alert.product.url;

    return `<div style="background-color: #0e0337; color: #fff; font-size: 20px">
                <div style="width: max-content; margin: 0 auto;">
                    <div style="height: 200px; margin: 20px auto;">
                        <img style="height: 100%; width: 100%; object-fit: contain; margin: auto;" src="${img}" alt="" />
                    </div>
                    <div style="text-align: center;">
                        <span>Your alert for <strong>${title}</strong></span> <br> <br>
                        <span>
                            Notification price: <span style="color: #c3a211; font-weight: 900;">${targetPrice}</span><br>
                            Current price: <span style="color: #c3a211; font-weight: 900;">${currentPrice}</span>
                        </span> <br> <br>
                        <span>
                            <a href="${link}" style="text-decoration: underline; color: #3111a9;">Buy now on Amazon</a>
                        </span>
                    </div>
                </div>
            </div>`;
};
