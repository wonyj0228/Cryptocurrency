import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { fetchCoinData } from '../api';

interface ICoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: object;
  last_updated: string;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`;

const MainBox = styled.div`
  position: relative;
  width: 60%;
`;

const CoinName = styled.div`
  display: flex;
  img {
    width: 50px;
  }
  div {
    border-left: ${(props) => props.theme.borderColor};
    padding: 10px 10px;
    margin: 0 10px;
    font-size: 30px;
    font-weight: bold;
  }
`;
const PriceChange = styled.div<{ $isPositive: boolean }>`
  color: ${(props) =>
    props.$isPositive ? props.theme.redColor : props.theme.blueColor};
  padding: 10px 0;
`;
const CurrentPrice = styled.span`
  font-weight: bold;
  font-size: 25px;
`;
const PriceChgPer = styled.span`
  font-size: calc(12px + 0.3vw);
  padding: 0 10px;
`;
const PriceInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: calc(9px + 0.3vw);
  div:nth-child(1) {
    color: ${(props) => props.theme.redColor};
  }
  div:nth-child(2) {
    color: ${(props) => props.theme.blueColor};
  }
`;
const InfoRow = styled.div`
  padding-right: 20px;
`;
const InfoTitle = styled.span`
  color: ${(props) => props.theme.tableHeadColor};
  padding-right: 7px;
`;
const InfoContent = styled.span``;

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();

  const { isLoading, data } = useQuery<ICoin>(['coinInfo', coinId], () =>
    fetchCoinData(`${coinId}`)
  );
  let isPositive = true;
  let priceChgPer = '';
  const tempPer = data?.price_change_percentage_24h;

  if (tempPer) {
    if (tempPer >= 0) {
      isPositive = true;
      priceChgPer = `${tempPer.toFixed(2)}% (▲ ${data?.price_change_24h
        .toFixed(3)
        .slice(1)})`;
    } else {
      isPositive = false;
      priceChgPer = `${tempPer.toFixed(2)}% (▼ ${data?.price_change_24h
        .toFixed(3)
        .slice(1)})`;
    }
  }

  return (
    <>
      <Header />
      <Container>
        <MainBox>
          <CoinName>
            <img src={data?.image} alt="coinImg" />
            <div>{data?.name}</div>
          </CoinName>

          <PriceChange $isPositive={isPositive}>
            <CurrentPrice>{`$ ${data?.current_price.toLocaleString()}`}</CurrentPrice>
            <PriceChgPer>{priceChgPer}</PriceChgPer>
          </PriceChange>

          <PriceInfo>
            <InfoRow>
              <InfoTitle>고가</InfoTitle>
              <InfoContent>{data?.high_24h.toLocaleString()}</InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoTitle>저가</InfoTitle>
              <InfoContent>{data?.low_24h.toLocaleString()}</InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoTitle>시가총액</InfoTitle>
              <InfoContent>{data?.market_cap.toLocaleString()}</InfoContent>
            </InfoRow>
            <InfoRow>
              <InfoTitle>거래대금</InfoTitle>
              <InfoContent>{data?.total_volume.toLocaleString()}</InfoContent>
            </InfoRow>
          </PriceInfo>
        </MainBox>
      </Container>
    </>
  );
}
export default Coin;
