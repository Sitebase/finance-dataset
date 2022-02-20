import yahooFinance from 'yahoo-finance2'; // NOTE the .default
import coins from 'coinlist';
import { promises as fs } from 'fs';

yahooFinance.setGlobalConfig({ validation: { logErrors: false} });
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//console.log(coins.length);
//const top = coins.slice(0, 1000);

//console.log('batches', top);
console.log('----------------');
let results = [];
const batchSize = 500;
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
            result = await yahooFinance.quote(quote);
		} catch(err) {
			if (!err.result) {
				//console.log('err', err);
				return {
					status: 'fail',
					...coin
				};
			}
			result = err.result[0];
			//console.log('ERR validation', result.regularMarketPrice);

			if (!result) {
				//console.log('err', err);
				return {
					status: 'fail',
					...coin
				};
			}

			return {
				...result,
				...coin
			};
		}

		if (!result) {
			console.error('Unable to fetch', quote);
			return null;
		}

		return {
			...result,
			...coin
		};


    }));
    return data;
}

//console.log('TESTER', results.filter(v => v != undefined));
//const data = {
    //date: new Date().toISOString(),
    //coins: results.filter(v => v != undefined)
//}


await fs.writeFile('artifacts/crypto.json', JSON.stringify(results.filter(v => v && v.hasOwnProperty('regularMarketPrice')), null, 2));
