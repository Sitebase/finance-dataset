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
const gold = await safeQuote('GC=F');

const data = {
    eur: eur.regularMarketPrice,
    silver: silver.regularMarketPrice,
    gold: gold.regularMarketPrice,
    created: new Date().toISOString()
}

await fs.writeFile('artifacts/currencies.json', JSON.stringify(data, null, 2), { flag: 'w+' });
