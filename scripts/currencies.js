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

const eur = await safeQuote('EURUSD=X');
const silver = await safeQuote('SI=F');
const platinum = await safeQuote('PL=F');
const gold = await safeQuote('GC=F');
const btc = await safeQuote('BTC-USD');
const jpy = await safeQuote('JPYUSD=X');
const gbp = await safeQuote('GBPUSD=X');
const chf = await safeQuote('CHFUSD=X');

const data = {
    eur: eur.regularMarketPrice,
    silver: silver.regularMarketPrice,
    platinum: platinum.regularMarketPrice,
    gold: gold.regularMarketPrice,
    btc: btc.regularMarketPrice,
    jpy: jpy.regularMarketPrice,
    gbp: gbp.regularMarketPrice,
    chf: chf.regularMarketPrice,
    btc: btc.regularMarketPrice,
    created: new Date().toISOString()
}

console.log('result', data);
await fs.writeFile('artifacts/currencies.json', JSON.stringify(data, null, 2), { flag: 'w+' });
