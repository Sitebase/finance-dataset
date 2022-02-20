import yahooFinance from 'yahoo-finance2'; // NOTE the .default
import coins from 'coinlist';
import { promises as fs } from 'fs';

yahooFinance.setGlobalConfig({ validation: { logErrors: false} });
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log(coins.length);
const top = coins.slice(0, 14);

console.log('batches', top);
console.log('----------------');
let results = [];
const batchSize = 1000;
for(let i=0; i < Math.ceil(coins.length/batchSize); i++) {
    const start = i * batchSize;
    const end = start + batchSize;
    const batch = coins.slice(start, end);
    const data = await getQuotes(batch);
    console.log(data);
    console.log('----', data.length);
    results = results.concat(data);

    await sleep(1000);
}

async function getQuotes(c) {
    const data = await Promise.all(c.map(async (coin) => {

        const quote = `${coin.symbol}-USD`;

        let result = null;
        try {
            result = await yahooFinance.quoteCombine(quote);
        } catch(err) {

            if (!err.result)
                console.log('err', err);
            result = err.result[0];
        }

        return {
            ...result,
            ...coin
        };

    }));
    return data;
}

const data = {
    date: new Date().toISOString(),
    coins: results
}

await fs.writeFile('artifacts/crypto.json', JSON.stringify(results, null, 2));
