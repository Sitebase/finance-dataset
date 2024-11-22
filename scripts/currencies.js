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

const eur = await safeQuote('EURUSD=X');
const silver = await safeQuote('SI=F');
const platinum = await safeQuote('PL=F');
const gold = await safeQuote('GC=F');
const btc = await safeQuote('BTC-USD');
const jpy = await safeQuote('JPYUSD=X');
const gbp = await safeQuote('GBPUSD=X');
const chf = await safeQuote('CHFUSD=X');

const data = {
    eur: roundTo(eur.regularMarketPrice, 2),
    silver: roundTo(silver.regularMarketPrice, 2),
    platinum: roundTo(platinum.regularMarketPrice, 2),
    gold: roundTo(gold.regularMarketPrice, 2),
    btc: roundTo(btc.regularMarketPrice, 2),
    jpy: roundTo(jpy.regularMarketPrice, 2),
    gbp: roundTo(gbp.regularMarketPrice, 2),
    chf: roundTo(chf.regularMarketPrice, 2),
    btc: roundTo(btc.regularMarketPrice, 2),
    created: new Date().toISOString()
}

console.log('result', data);
await fs.writeFile('artifacts/currencies.json', JSON.stringify(data, null, 2), { flag: 'w+' });
