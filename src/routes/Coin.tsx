import { Outlet, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { fetchCoinData } from '../api';
import { BeatLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ICurrency {
  usd: number;
}

interface IMarket {
  current_price: ICurrency;
  market_cap: ICurrency;
  total_volume: ICurrency;
  high_24h: ICurrency;
  low_24h: ICurrency;
  price_change_24h_in_currency: ICurrency;
  price_change_percentage_24h: number;
}

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  description: { en: string };
  image: { small: string };
  market_data: IMarket;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const LoadingContainer = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DescBox = styled.div`
  padding-top: 50px;
  width: 60%;
`;

const DescTitle = styled.span`
  font-size: 25px;
  font-weight: bold;
`;

const DescContent = styled.div`
  border: ${(props) => props.theme.borderColor};
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px 10px;

  letter-spacing: 1px;
  line-height: 20px;
  font-size: calc(9px + 0.4vw);
  a {
    text-decoration: underline solid 1px ${(props) => props.theme.accentColor};
  }
`;

const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  margin-top: 30px;
`;
const ChartTaps = styled.div`
  display: flex;
`;
const ChartTap = styled.div`
  text-align: center;
  width: 25%;
  a {
    font-size: calc(9px + 0.4vw);
    display: block;
    height: 40px;
    line-height: 40px;
    background-color: rgba(80, 80, 80, 0.1);
    border: ${(props) => props.theme.borderColor};
    color: ${(props) => props.theme.accentColor};
    font-weight: bold;
  }
`;
const ChartContent = styled.div``;

////////////////////////////////////////////////////////////////////////////////////////
function Coin() {
  const { coinId } = useParams<{ coinId: string }>();
  const [days, setDays] = useState(7);

  const { isLoading: infoLoading, data: infoData } = useQuery<ICoin>(
    ['coinInfo', coinId],
    () => fetchCoinData(`${coinId}`)
  );

  let isPositive = true;
  let priceChgPer = '';
  const tempPer = infoData?.market_data.price_change_percentage_24h;

  if (tempPer) {
    if (tempPer >= 0) {
      isPositive = true;
      priceChgPer = `${tempPer.toFixed(
        2
      )}% (▲ ${infoData?.market_data.price_change_24h_in_currency.usd
        .toFixed(3)
        .slice(1)})`;
    } else {
      isPositive = false;
      priceChgPer = `${tempPer.toFixed(
        2
      )}% (▼ ${infoData?.market_data.price_change_24h_in_currency.usd
        .toFixed(3)
        .slice(1)})`;
    }
  }

  return (
    <>
      <Header />
      {infoLoading ? (
        <LoadingContainer>
          <BeatLoader color="#FDDE55" margin={30} size={20} />
        </LoadingContainer>
      ) : (
        <Container>
          <MainBox>
            <CoinName>
              <img src={infoData?.image.small} alt="coinImg" />
              <div>{infoData?.name}</div>
            </CoinName>

            <PriceChange $isPositive={isPositive}>
              <CurrentPrice>{`$ ${infoData?.market_data.current_price.usd.toLocaleString()}`}</CurrentPrice>
              <PriceChgPer>{priceChgPer}</PriceChgPer>
            </PriceChange>

            <PriceInfo>
              <InfoRow>
                <InfoTitle>고가</InfoTitle>
                <InfoContent>
                  {infoData?.market_data.high_24h.usd.toLocaleString()}
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoTitle>저가</InfoTitle>
                <InfoContent>
                  {infoData?.market_data.low_24h.usd.toLocaleString()}
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoTitle>시가총액</InfoTitle>
                <InfoContent>
                  {infoData?.market_data.market_cap.usd.toLocaleString()}
                </InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoTitle>거래대금</InfoTitle>
                <InfoContent>
                  {infoData?.market_data.total_volume.usd.toLocaleString()}
                </InfoContent>
              </InfoRow>
            </PriceInfo>
          </MainBox>
          <ChartBox>
            <ChartTaps>
              <ChartTap>
                <Link onClick={() => setDays(7)} to={`/${coinId}/chart`}>
                  7 days
                </Link>
              </ChartTap>
              <ChartTap>
                <Link onClick={() => setDays(30)} to={`/${coinId}/chart`}>
                  30 days
                </Link>
              </ChartTap>
              <ChartTap>
                <Link onClick={() => setDays(90)} to={`/${coinId}/chart`}>
                  3 months
                </Link>
              </ChartTap>
              <ChartTap>
                <Link onClick={() => setDays(365)} to={`/${coinId}/chart`}>
                  1 year
                </Link>
              </ChartTap>
            </ChartTaps>
            <ChartContent>
              <Outlet context={{ coinId, days }} />
            </ChartContent>
          </ChartBox>
          <DescBox>
            <DescTitle>Description</DescTitle>
            <DescContent
              dangerouslySetInnerHTML={{
                __html: `${infoData?.description.en}`,
              }}
            ></DescContent>
          </DescBox>
        </Container>
      )}
    </>
  );
}
export default Coin;
