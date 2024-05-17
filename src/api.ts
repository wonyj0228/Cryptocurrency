const BAST_URL = `https://api.coingecko.com/api/v3`;
const API_KEY = process.env.REACT_APP_COIN;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': API_KEY || '',
  },
};
export function fetchCoins() {
  return fetch(`${BAST_URL}/coins/markets?vs_currency=usd`, options)
    .then((response) => response.json())
    .then((json) => json.slice(0, 50));
}
