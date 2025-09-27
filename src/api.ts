const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data';
const CRYPTOCOMPARE_IMAGE_URL = 'https://www.cryptocompare.com';

export function fetchCoins() {
  return fetch(`${CRYPTOCOMPARE_BASE_URL}/top/totalvolfull?limit=50&tsym=USD`)
    .then((response) => response.json())
    .then((data) => {
      return data.Data.map((item: any) => {
        const coinInfo = item.CoinInfo;
        const rawUSD = item.RAW?.USD;

        return {
          id: coinInfo.Name,
          symbol: coinInfo.Name,
          name: coinInfo.FullName,
          image: `${CRYPTOCOMPARE_IMAGE_URL}${coinInfo.ImageUrl}`,
          current_price: rawUSD?.PRICE || 0,
          price_change_24h: rawUSD?.CHANGE24HOUR || 0,
          price_change_percentage_24h: rawUSD?.CHANGEPCT24HOUR || 0,
        };
      });
    });
}

export function fetchCoinDetailData(coinId: string) {
  // 기본 가격 정보 + 추가 상세 정보
  const priceDataPromise = fetch(`${CRYPTOCOMPARE_BASE_URL}/pricemultifull?fsyms=${coinId}&tsyms=USD`).then(
    (response) => response.json()
  );

  // 소셜 미디어 및 추가 정보
  const coinInfoPromise = fetch(`${CRYPTOCOMPARE_BASE_URL}/all/coinlist`).then((response) => response.json());

  return Promise.all([priceDataPromise, coinInfoPromise]).then(([priceData, coinListData]) => {
    const rawUSD = priceData.RAW[coinId]?.USD;
    const displayUSD = priceData.DISPLAY[coinId]?.USD;
    const coinInfo = coinListData.Data[coinId];

    return {
      // 기본 정보
      id: coinId,
      symbol: coinId,
      name: coinInfo?.FullName || displayUSD?.FROMSYMBOL || coinId,
      image: coinInfo?.ImageUrl ? `${CRYPTOCOMPARE_IMAGE_URL}${coinInfo.ImageUrl}` : '',

      // 가격 정보
      current_price: rawUSD?.PRICE || 0,
      price_change_24h: rawUSD?.CHANGE24HOUR || 0,
      price_change_percentage_24h: rawUSD?.CHANGEPCT24HOUR || 0,

      // 거래량 및 시장 정보
      volume_24h: rawUSD?.VOLUME24HOURTO || 0,
      volume_24h_from: rawUSD?.VOLUME24HOUR || 0, // 코인 단위 거래량
      market_cap: rawUSD?.MKTCAP || 0,

      // 24시간 고가/저가
      high_24h: rawUSD?.HIGH24HOUR || 0,
      low_24h: rawUSD?.LOW24HOUR || 0,

      // 추가 유의미한 데이터들
      open_24h: rawUSD?.OPEN24HOUR || 0, // 24시간 전 시가
      total_volume_24h: rawUSD?.TOTALVOLUME24H || 0, // 총 거래량
      total_volume_24h_to: rawUSD?.TOTALVOLUME24HTO || 0, // USD 기준 총 거래량

      // 공급량 정보
      supply: rawUSD?.SUPPLY || 0, // 유통 공급량

      // 최근 업데이트 시간
      last_update: rawUSD?.LASTUPDATE ? new Date(rawUSD.LASTUPDATE * 1000).toLocaleString() : '',

      // 기술적 정보
      algorithm: coinInfo?.Algorithm || 'N/A', // 알고리즘 (SHA-256, Scrypt 등)
      proof_type: coinInfo?.ProofType || 'N/A', // 합의 메커니즘 (PoW, PoS 등)

      // 시장 정보
      total_top_tier_volume_24h: rawUSD?.TOPTIERVOLUME24HOUR || 0, // 상위 거래소 거래량
      total_top_tier_volume_24h_to: rawUSD?.TOPTIERVOLUME24HOURTO || 0,
    };
  });
}

export function fetchChartData(coinId: string, days: number): Promise<number[][]> {
  let endpoint = 'histoday';
  let limit = days;

  if (days <= 1) {
    endpoint = 'histohour';
    limit = 24;
  }

  return fetch(`${CRYPTOCOMPARE_BASE_URL}/v2/${endpoint}?fsym=${coinId}&tsym=USD&limit=${limit}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`CryptoCompare API error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.Response === 'Error') {
        throw new Error(data.Message || 'CryptoCompare API error');
      }

      // OHLC 형식으로 반환: [timestamp, open, high, low, close]
      return data.Data.Data.map((item: any) => [
        item.time * 1000, // milliseconds로 변환
        item.open || item.close, // open이 없으면 close 사용
        item.high || item.close, // high가 없으면 close 사용
        item.low || item.close, // low가 없으면 close 사용
        item.close,
      ]);
    });
}
