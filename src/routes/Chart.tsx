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
  } = useQuery<number[][]>(['chart', coinId, days], () => fetchChartData(coinId, days), {
    refetchOnWindowFocus: false,
    refetchInterval: 600000,
    staleTime: 600000,
    retry: 2, // 추가: 재시도 로직
  });
  return (
    <>
      {chartLoading ? (
        <LoadingContainer>
          <BeatLoader color="#FDDE55" margin={30} size={20} />
        </LoadingContainer>
      ) : chartError ? (
        <ErrorContainer>
          <div>Sorry, we can't seem to find the data you're looking for.</div>
          <div>CRYPTOCURRENCY는 무료 API 데이터로 서비스 중입니다. 잠시 후 다시 시도해주세요.</div>
        </ErrorContainer>
      ) : (
        <ReactApexCharts
          type="candlestick"
          series={[
            {
              name: `${coinId} Price`, // 추가: 시리즈 이름
              data:
                chartData?.map((item) => {
                  // 변경: price → item (매개변수명 변경)
                  return {
                    x: new Date(item[0]), // timestamp
                    y: [
                      item[1], // open   (변경: price.slice(1) → 명시적 OHLC 배열)
                      item[2], // high
                      item[3], // low
                      item[4], // close
                    ],
                  };
                }) || [],
            },
          ]}
          width="100%"
          height="100%"
          options={{
            chart: {
              // 추가: 차트 기본 설정
              type: 'candlestick',
              background: 'transparent',
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              type: 'datetime',
              labels: {
                style: {
                  colors: theme ? 'white' : 'black',
                },
                datetimeFormatter: {
                  year: 'yyyy',
                  month: "MMM 'yy",
                  day: 'dd MMM',
                  hour: 'HH:mm',
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  colors: theme ? 'white' : 'black',
                },
                formatter: (value: number) => `$${value.toLocaleString()}`, // 추가: Y축 레이블 포맷팅
              },
            },
            grid: {
              borderColor: theme ? '#444' : '#e0e0e0',
            },
            tooltip: {
              theme: theme ? 'dark' : 'light',
              x: {
                format: 'dd MMM yyyy HH:mm',
              },
              y: {
                formatter: (value: number) => `$${value.toLocaleString()}`,
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: '#00B746',
                  downward: '#EF403C',
                },
                wick: {
                  useFillColor: true,
                },
              },
            },
          }}
        />

        //   <ReactApexCharts
        //     type="candlestick"
        //     series={[
        //       {
        //         name: `${coinId} Price`, // 추가: 시리즈 이름
        //         data:
        //           chartData?.map((item) => {
        //             // 변경: price → item (매개변수명 변경)
        //             return {
        //               x: new Date(item[0]), // timestamp
        //               y: [
        //                 item[1], // open   (변경: price.slice(1) → 명시적 OHLC 배열)
        //                 item[2], // high
        //                 item[3], // low
        //                 item[4], // close
        //               ],
        //             };
        //           }) || [],
        //       },
        //     ]}
        //     width={`100%`}
        //     height={`100%`}
        //     options={{
        //       xaxis: {
        //         type: 'datetime',
        //         labels: {
        //           datetimeFormatter: {
        //             hour: 'HH:mm',
        //           },
        //           style: {
        //             colors: theme ? 'white' : 'black',
        //           },
        //         },
        //       },
        //       yaxis: {
        //         labels: {
        //           style: {
        //             colors: theme ? 'white' : 'black',
        //           },
        //         },
        //       },
        //     }}
        //   />
        // )}
      )}
    </>
  );
};

export default Chart;
