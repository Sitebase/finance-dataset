import fetch from 'node-fetch';
import { promises as fs } from 'fs';

const response = await fetch('https://min-api.cryptocompare.com/data/all/exchanges');
const data = await response.json();

let symbols = [];
Object.keys(data).forEach(exchange => {
    const coins = data[exchange];

    symbols = symbols.concat(Object.keys(coins));

});

const uniqueSymbols = [...new Set(symbols)];
console.log('res', uniqueSymbols);

await fs.writeFile('artifacts/crypto-symbols.json', JSON.stringify(uniqueSymbols, null, 2), { flag: 'w+' });
