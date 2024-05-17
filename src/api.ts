const BAST_URL = `https://api.coingecko.com/api/v3`;

const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-4iXdVga9uwTxWFzFxSiWXYsq'}
};

export function fetchCoins() {
    return fetch(`${BAST_URL}/simple/supported_vs_currencies`, options)
    .then(response => response.json())
}
