import yahooFinance from 'yahoo-finance2'; // NOTE the .default
import { promises as fs } from 'fs';

yahooFinance.setGlobalConfig({ validation: { logErrors: false} });

async function safeQuote(quote) {
    try {
        const res = await yahooFinance.quoteCombine(quote);
        return res;
    } catch(err) {
        if (err.result)
            return err.result[0];

        console.log('err', err);
    }
}

function roundTo(n, decimalPlaces) {
  return +(+(Math.round((n + 'e+' + decimalPlaces)) + 'e-' + decimalPlaces)).toFixed(decimalPlaces);
}

const iwda = await safeQuote('IWDA.AS');
const susw = await safeQuote('SUSW.L');
const net = await safeQuote('NET');
const shop = await safeQuote('SHOP');
const spot = await safeQuote('SPOT');
const nflx = await safeQuote('NFLX');

const data = {
    iwda: roundTo(iwda.regularMarketPrice, 2),
    susw: roundTo(susw.regularMarketPrice, 2),
    net: roundTo(net.regularMarketPrice, 2),
    shop: roundTo(shop.regularMarketPrice, 2),
    spot: roundTo(spot.regularMarketPrice, 2),
    nflx: roundTo(nflx.regularMarketPrice, 2),
    created: new Date().toISOString()
}

console.log('result', data);
await fs.writeFile('artifacts/stocks.json', JSON.stringify(data, null, 2), { flag: 'w+' });
