const yahooFinance = require('yahoo-finance2').default; // NOTE the .default
const results = await yahooFinance.search('AAPL');


console.log('res', result);
