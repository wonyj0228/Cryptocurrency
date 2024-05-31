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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;

const Chart = () => {
  const { coinId, days } = useOutletContext<IParams>();
  const { theme } = useContext(ThemeContext);

  const { isLoading: chartLoading, data: chartData } = useQuery<number[][]>(
    ['chart', coinId, days],
    () => fetchChartData(`${coinId}`, days)
  );

  return (
    <>
      {chartLoading ? (
        <LoadingContainer>
          <BeatLoader color="#FDDE55" margin={30} size={20} />
        </LoadingContainer>
      ) : (
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
          height={`auto`}
          options={{
            xaxis: {
              type: 'datetime',
              labels: {
                datetimeFormatter: {
                  hour: 'HH:mm',
                },
                style: {
                  colors: theme === true ? 'white' : 'black',
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  colors: theme === false ? 'white' : 'black',
                },
              },
            },
          }}
        />
      )}
    </>
  );
};

export default Chart;
