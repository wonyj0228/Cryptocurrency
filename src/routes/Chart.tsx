import { useQuery } from 'react-query';
import { fetchChartData } from '../api';
import { useOutletContext } from 'react-router-dom';
import ReactApexCharts from 'react-apexcharts';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import { useContext } from 'react';
import { ThemeContext } from '../App';

interface IParams {
  coinId: string;
  days: number;
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
  padding: 0 20px;

  div:nth-child(1) {
    color: ${(props) => props.theme.accentColor};
    font-size: calc(20px + 0.7vw);
    height: 150px;
    padding-top: 70px;
  }

  div:nth-child(2) {
    color: ${(props) => props.theme.textColor};
    height: 70px;
    padding-top: 20px;
    font-size: calc(10px + 0.5vw);
  }
`;

const Chart = () => {
  const { coinId, days } = useOutletContext<IParams>();
  const { theme } = useContext(ThemeContext);

  const {
    isLoading: chartLoading,
    data: chartData,
    error: chartError,
  } = useQuery<number[][]>(
    ['chart', coinId, days],
    () => fetchChartData(`${coinId}`, days),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 600000,
      staleTime: 600000,
    }
  );

  return (
    <>
      {chartLoading ? (
        <LoadingContainer>
          <BeatLoader color="#FDDE55" margin={30} size={20} />
        </LoadingContainer>
      ) : chartError === null ? (
        <ReactApexCharts
          type="candlestick"
          series={[
            {
              data:
                chartData?.map((price) => {
                  return { x: new Date(price[0]), y: price.slice(1) };
                }) || [],
            },
          ]}
          width={`100%`}
          height={`100%`}
          options={{
            xaxis: {
              type: 'datetime',
              labels: {
                datetimeFormatter: {
                  hour: 'HH:mm',
                },
                style: {
                  colors: theme ? 'white' : 'black',
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  colors: theme ? 'white' : 'black',
                },
              },
            },
          }}
        />
      ) : (
        <ErrorContainer>
          <div>Sorry, we can't seem to find the data you're looking for.</div>
          <div>
            CRYPTOCURRENCY는 무료 API 데이터로 서비스 중입니다. 잠시 후 다시
            시도해주세요.
          </div>
        </ErrorContainer>
      )}
    </>
  );
};

export default Chart;
