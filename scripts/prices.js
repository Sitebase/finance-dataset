import yahooFinance from 'yahoo-finance2'; // NOTE the .default
const results = await yahooFinance.search('BAFE');


console.log('res', results);
