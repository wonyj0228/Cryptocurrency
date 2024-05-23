const BASE_URL = `https://api.coingecko.com/api/v3`;
const API_KEY = process.env.REACT_APP_COIN;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-cg-demo-api-key': API_KEY || '',
  },
};
export function fetchCoins() {
  return fetch(`${BASE_URL}/coins/markets?vs_currency=usd`, options)
    .then((response) => response.json())
    .then((json) => json.slice(0, 50));
}

export function fetchCoinData(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`, options).then((response) =>
    response.json()
  );
}

export function fetchChartData(coinId: string, days: number) {
  return fetch(
    `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    options
  ).then((response) => response.json());
}
