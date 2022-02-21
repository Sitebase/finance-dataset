import yahooFinance from 'yahoo-finance2';

const query = 'TSLA';
const queryOptions = { period1: '2022-02-15T02:00:00.000Z'};
const result = await yahooFinance.historical(query, queryOptions);
console.log('hist', result);
