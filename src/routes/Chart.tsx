import { useQuery } from 'react-query';
import { fetchChartData } from '../api';
import { useOutletContext } from 'react-router-dom';
import ReactApexCharts from 'react-apexcharts';

interface IParams {
  coinId: string;
  days: number;
}

const Chart = () => {
  const { coinId, days } = useOutletContext<IParams>();

  const { isLoading: chartLoading, data: chartData } = useQuery<number[][]>(
    ['chart', coinId, days],
    () => fetchChartData(`${coinId}`, days)
  );

  const options = {};

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  return (
    <ReactApexCharts
      type="candlestick"
      series={[
        {
          data:
            chartData?.map((price) => {
              return { x: formatDate(new Date(price[0])), y: price.slice(1) };
            }) || [],
        },
      ]}
      width={`100%`}
      height={`auto`}
      options={options}
    />
  );
};

export default Chart;
