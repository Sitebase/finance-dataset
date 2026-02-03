import YahooFinance from 'yahoo-finance2';
import { promises as fs } from 'fs';

const yahooFinance = new YahooFinance();

function roundTo(n, decimalPlaces) {
    return +(+(Math.round((n + 'e+' + decimalPlaces)) + 'e-' + decimalPlaces)).toFixed(decimalPlaces);
}

async function fetchWithRetry(symbols, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await yahooFinance.quote(symbols);
        } catch (err) {
            if (attempt === maxRetries) throw err;
            const delay = attempt * 2000;
            console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

const symbols = ['EURUSD=X', 'SI=F', 'PL=F', 'GC=F', 'BTC-USD', 'ETH-USD', 'JPYUSD=X', 'GBPUSD=X', 'CHFUSD=X'];
const results = await fetchWithRetry(symbols);

const priceMap = {};
for (const quote of results) {
    priceMap[quote.symbol] = quote.regularMarketPrice;
}

const data = {
    eur: roundTo(priceMap['EURUSD=X'], 2),
    silver: roundTo(priceMap['SI=F'], 2),
    platinum: roundTo(priceMap['PL=F'], 2),
    gold: roundTo(priceMap['GC=F'], 2),
    btc: roundTo(priceMap['BTC-USD'], 2),
    eth: roundTo(priceMap['ETH-USD'], 2),
    jpy: roundTo(priceMap['JPYUSD=X'], 2),
    gbp: roundTo(priceMap['GBPUSD=X'], 2),
    chf: roundTo(priceMap['CHFUSD=X'], 2),
    created: new Date().toISOString()
}

console.log('result', data);
await fs.writeFile('artifacts/currencies.json', JSON.stringify(data, null, 2), { flag: 'w+' });
