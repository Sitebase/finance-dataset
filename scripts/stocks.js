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

const iwda = await safeQuote('IWDA.AS');
const susw = await safeQuote('SUSW.L');

const data = {
    iwda: iwda.regularMarketPrice,
    susw: susw.regularMarketPrice,
    created: new Date().toISOString()
}

console.log('result', data);
await fs.writeFile('artifacts/stocks.json', JSON.stringify(data, null, 2), { flag: 'w+' });
