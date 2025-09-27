import { Outlet, useParams } from 'react-router-dom';
import Header from '../Components/Header';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { fetchCoinDetailData, fetchCoins } from '../api';
import { BeatLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ICoin {
  // 기본 식별 정보
  id: string;
  symbol: string;
  name: string;
  image: string;

  // 가격 정보
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  open_24h: number; // 추가: 24시간 전 시가
  high_24h: number;
  low_24h: number;

  // 거래량 정보
  volume_24h: number; // USD 기준 거래량
  volume_24h_from: number; // 추가: 코인 단위 거래량
  total_volume_24h: number; // 추가: 총 거래량
  total_volume_24h_to: number; // 추가: USD 기준 총 거래량
  total_top_tier_volume_24h: number; // 추가: 상위 거래소 거래량
  total_top_tier_volume_24h_to: number; // 추가: 상위 거래소 USD 거래량

  // 시장 정보
  market_cap: number;
  supply: number; // 추가: 유통 공급량

  // 기술적 정보
  algorithm: string; // 추가: 알고리즘 (SHA-256, Scrypt 등)
  proof_type: string; // 추가: 합의 메커니즘 (PoW, PoS 등)

  // 메타데이터
  last_update: string; // 추가: 마지막 업데이트 시간
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
`;

const MainBox = styled.div`
  position: relative;
  width: 60%;
`;

const CoinName = styled.div`
  display: flex;
  color: ${(props) => props.theme.textColor};
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
  color: ${(props) => (props.$isPositive ? props.theme.redColor : props.theme.blueColor)};
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
  color: ${(props) => props.theme.textColor};
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
  color: ${(props) => props.theme.tableHeadTextColor};
  padding-right: 7px;
`;
const InfoContent = styled.span``;

const LoadingContainer = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  background-color: ${(props) => props.theme.bgColor};
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
  color: ${(props) => props.theme.textColor};
`;

const DescContent = styled.div`
  border: ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 10px;
  margin-top: 15px;
  padding: 10px 10px;

  letter-spacing: 1px;
  line-height: 20px;
  font-size: calc(9px + 0.4vw);
  a {
    color: ${(props) => props.theme.accentColor};
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
    font-size: calc(12px + 0.4vw);
    display: block;
    height: 50px;
    line-height: 50px;
    background-color: ${(props) => props.theme.grayColor};
    border: ${(props) => props.theme.borderColor};
    color: ${(props) => props.theme.accentColor};
    font-weight: bold;
  }
`;

const ChartContent = styled.div`
  border: ${(props) => props.theme.borderColor};
  height: 50vh;
`;

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();
  const [days, setDays] = useState(1);

  const { isLoading: infoLoading, data: infoData } = useQuery<ICoin>(
    ['coinInfo', coinId],
    () => fetchCoinDetailData(`${coinId}`),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 600000,
      staleTime: 600000,
    }
  );

  // 코인 리스트에서 이미지 정보 가져오기
  const { data: coinList } = useQuery<ICoin[]>('coinIds', fetchCoins, {
    staleTime: 600000,
  });
  const coinImage = coinList?.find((coin) => coin.id === coinId)?.image || '/default-coin-icon.png';

  // 등락률 계산
  const isPositive = (infoData?.price_change_percentage_24h || 0) >= 0;
  const priceChgPer = infoData?.price_change_percentage_24h
    ? `${infoData.price_change_percentage_24h.toFixed(2)}% (${isPositive ? '▲' : '▼'} ${Math.abs(
        infoData.price_change_24h
      ).toFixed(3)})`
    : '';

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
              <img src={coinImage} alt="coinImg" />
              <div>{infoData?.name}</div>
            </CoinName>

            <PriceChange $isPositive={isPositive}>
              <CurrentPrice>$ {infoData?.current_price?.toLocaleString()}</CurrentPrice>
              <PriceChgPer>{priceChgPer}</PriceChgPer>
            </PriceChange>

            <PriceInfo>
              <InfoRow>
                <InfoTitle>고가</InfoTitle>
                <InfoContent>$ {infoData?.high_24h?.toLocaleString() || 'N/A'}</InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoTitle>저가</InfoTitle>
                <InfoContent>$ {infoData?.low_24h?.toLocaleString() || 'N/A'}</InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoTitle>시가총액</InfoTitle>
                <InfoContent>$ {infoData?.market_cap?.toLocaleString() || 'N/A'}</InfoContent>
              </InfoRow>
              <InfoRow>
                <InfoTitle>거래대금</InfoTitle>
                <InfoContent>$ {infoData?.volume_24h?.toLocaleString() || 'N/A'}</InfoContent>
              </InfoRow>
            </PriceInfo>
          </MainBox>

          <ChartBox>
            <ChartTaps>
              <ChartTap>
                <Link onClick={() => setDays(1)} to={`/${coinId}/chart`}>
                  1 day
                </Link>
              </ChartTap>
              <ChartTap>
                <Link onClick={() => setDays(30)} to={`/${coinId}/chart`}>
                  30 days
                </Link>
              </ChartTap>
              <ChartTap>
                <Link onClick={() => setDays(180)} to={`/${coinId}/chart`}>
                  6 months
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
            <DescTitle>상세 정보</DescTitle>
            <DescContent>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* 거래량 정보 */}
                <div>
                  <h4 style={{ color: '#2196f3', marginBottom: '10px' }}>거래량 정보</h4>
                  <p>
                    <strong>24시간 거래량:</strong> {infoData?.volume_24h?.toLocaleString()} USD
                  </p>
                  <p>
                    <strong>24시간 거래량(코인):</strong> {infoData?.volume_24h_from?.toLocaleString()} {coinId}
                  </p>
                  <p>
                    <strong>상위 거래소 거래량:</strong> {infoData?.total_top_tier_volume_24h_to?.toLocaleString()} USD
                  </p>
                </div>

                {/* 공급량 정보 */}
                <div>
                  <h4 style={{ color: '#2196f3', marginBottom: '10px' }}>공급량 정보</h4>
                  <p>
                    <strong>유통 공급량:</strong> {infoData?.supply?.toLocaleString()} {coinId}
                  </p>
                  <p>
                    <strong>시가총액:</strong> ${infoData?.market_cap?.toLocaleString()}
                  </p>
                  <p>
                    <strong>24시간 시가:</strong> ${infoData?.open_24h?.toLocaleString()}
                  </p>
                </div>

                {/* 기술적 정보 */}
                <div>
                  <h4 style={{ color: '#2196f3', marginBottom: '10px' }}>기술적 정보</h4>
                  <p>
                    <strong>알고리즘:</strong> {infoData?.algorithm}
                  </p>
                  <p>
                    <strong>합의 메커니즘:</strong> {infoData?.proof_type}
                  </p>
                  <p>
                    <strong>마지막 업데이트:</strong> {infoData?.last_update}
                  </p>
                </div>

                {/* 시장 성과 */}
                <div>
                  <h4 style={{ color: '#2196f3', marginBottom: '10px' }}>24시간 성과</h4>
                  <p>
                    <strong>시가:</strong> ${infoData?.open_24h?.toLocaleString()}
                  </p>
                  <p>
                    <strong>고가:</strong> ${infoData?.high_24h?.toLocaleString()}
                  </p>
                  <p>
                    <strong>저가:</strong> ${infoData?.low_24h?.toLocaleString()}
                  </p>
                  <p>
                    <strong>현재가:</strong> ${infoData?.current_price?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* 거래량 vs 시가총액 비율 */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  borderRadius: '8px',
                }}
              >
                <h4 style={{ color: '#2196f3', marginBottom: '10px' }}>시장 활성도</h4>
                <p>
                  <strong>거래량/시가총액 비율:</strong>{' '}
                  {infoData?.market_cap && infoData?.volume_24h
                    ? ((infoData.volume_24h / infoData.market_cap) * 100).toFixed(2) + '%'
                    : 'N/A'}
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>* 높은 비율일수록 활발한 거래를 의미합니다</p>
              </div>
            </DescContent>
          </DescBox>
        </Container>
      )}
    </>
  );
}
export default Coin;
