import { useQuery } from 'react-query';
import { fetchCoins } from '../api';
import styled from 'styled-components';
import Header from '../Components/Header';
import coverImage from '../Img/coverImg.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

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
  margin: 0 auto;
  background-color: ${(props) => props.theme.bgColor};
  padding-bottom: 50px;
`;

const Cover = styled.div`
  width: 100%;
  height: 25vh;
  background-color: #163e64;
  display: flex;
  justify-content: center;
`;

const CoverText = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: rgb(244, 244, 244);

  div {
    font-size: calc(14px + 2vw);
    font-weight: bold;
    margin-bottom: calc(10px + 1vh);
  }

  span {
    font-size: calc(10px + 0.2vw);
  }
`;

const CoverImg = styled.div`
  width: 20%;
  background-image: url(${coverImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  filter: opacity(0.5) grayscale(1);
`;

const CoinList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  width: 60%;
  height: 10vh;
  display: flex;
  align-items: center;
  font-size: calc(14px + 1vw);
  font-weight: bold;
  color: ${(props) => props.theme.textColor};

  svg {
    color: #fbc522;
    margin-right: 10px;
  }
`;

const List = styled.div`
  width: 60%;
  border: ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.tableBodyBgColor};
  border-radius: 10px;
  min-width: 300px;

  table {
    width: 100%;

    thead {
      color: ${(props) => props.theme.tableHeadTextColor};
      font-weight: bold;
      font-size: 15px;
      height: 50px;
      border-bottom: ${(props) => props.theme.borderColor};
      th {
        padding: 20px 0;
      }
    }
    tbody {
      font-size: calc(10px + 0.2vw);
      color: ${(props) => props.theme.textColor};
      tr {
        border-bottom: ${(props) => props.theme.trBorderColor};
        transition: background-color 0.3s ease;
        cursor: pointer;
        &:hover {
          background-color: ${(props) => props.theme.trHoverColor};
        }
      }
      td {
        padding: 10px 10px;
      }
      td:nth-child(2),
      td:nth-child(3),
      td:nth-child(4) {
        text-align: end;
        vertical-align: middle;
      }
    }
  }
`;

const Coin = styled.div`
  display: flex;
  img {
    width: calc(1.5rem + 1vw);
    height: calc(1.5rem + 1vw);
    margin-right: 10px;
  }
`;

const CoinInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  div:first-child {
    text-transform: uppercase;
    font-size: calc(12px + 0.4vw);
    color: ${(props) => props.theme.textColor};
    font-weight: bold;
  }
  div:nth-child(2) {
    color: ${(props) => props.theme.tableHeadTextColor};
  }
`;

const PriceChange = styled.td<{ $isPositive: boolean }>`
  color: ${(props) =>
    props.$isPositive ? props.theme.redColor : props.theme.blueColor};
`;

const LoadingContainer = styled.div`
  height: calc(100vh - 40vh);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>('coinIds', fetchCoins);
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container>
        <Cover>
          <CoverText>
            <div>CRYPTOCURRENCY</div>
            <span>코인 정보, 실시간 시세 간편하게 확인하세요.</span>
          </CoverText>
          <CoverImg />
        </Cover>

        {isLoading ? (
          <LoadingContainer>
            <BeatLoader color="#FDDE55" margin={30} size={20} />
          </LoadingContainer>
        ) : (
          <CoinList>
            <Title>
              <FontAwesomeIcon icon={faCoins} />
              <span>코인 리스트</span>
            </Title>
            <List>
              <table>
                <thead>
                  <tr>
                    <th>코인명</th>
                    <th>현재가</th>
                    <th>등락가</th>
                    <th>등락률</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((coin) => {
                    return (
                      <tr
                        key={coin.id}
                        onClick={() => navigate(`/${coin.id}/chart`)}
                      >
                        <td>
                          <Coin>
                            <img src={coin.image} alt="coinImg" />
                            <CoinInfo>
                              <div>{coin.symbol}</div>
                              <div>{coin.name}</div>
                            </CoinInfo>
                          </Coin>
                        </td>
                        <td>$ {coin.current_price.toLocaleString()}</td>
                        <PriceChange $isPositive={coin.price_change_24h > 0}>
                          ${' '}
                          {Number(coin.price_change_24h)
                            .toFixed(3)
                            .toLocaleString()}
                        </PriceChange>
                        <PriceChange
                          $isPositive={coin.price_change_percentage_24h > 0}
                        >
                          {Number(coin.price_change_percentage_24h).toFixed(2)}{' '}
                          %
                        </PriceChange>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </List>
          </CoinList>
        )}
      </Container>
    </>
  );
}

export default Coins;
