import YahooFinance from 'yahoo-finance2';
import { promises as fs } from 'fs';

const yahooFinance = new YahooFinance();

function roundTo(n, decimalPlaces) {
    return +(+(Math.round((n + 'e+' + decimalPlaces)) + 'e-' + decimalPlaces)).toFixed(decimalPlaces);
}

const symbols = ['IWDA.AS', 'SUSW.L', 'NET', 'SHOP', 'SPOT', 'NFLX', 'PRX.AS', 'BABA', 'CRWD'];
const results = await yahooFinance.quote(symbols);

const priceMap = {};
for (const quote of results) {
    priceMap[quote.symbol] = quote.regularMarketPrice;
}

const data = {
    iwda: roundTo(priceMap['IWDA.AS'], 2),
    susw: roundTo(priceMap['SUSW.L'], 2),
    net: roundTo(priceMap['NET'], 2),
    shop: roundTo(priceMap['SHOP'], 2),
    spot: roundTo(priceMap['SPOT'], 2),
    nflx: roundTo(priceMap['NFLX'], 2),
    prx: roundTo(priceMap['PRX.AS'], 2),
    baba: roundTo(priceMap['BABA'], 2),
    crwd: roundTo(priceMap['CRWD'], 2),
    created: new Date().toISOString()
}

console.log('result', data);
await fs.writeFile('artifacts/stocks.json', JSON.stringify(data, null, 2), { flag: 'w+' });
