import { useQuery } from 'react-query';
import { fetchChartData } from '../api';
import { useOutletContext } from 'react-router-dom';

interface IParams {
  coinId: string;
  days: number;
}

interface IChart {
  prices: number[][];
}

const Chart = () => {
  const { coinId, days } = useOutletContext<IParams>();

  const { isLoading: chartLoading, data: chartData } = useQuery<IChart>(
    ['chart', coinId, days],
    () => fetchChartData(`${coinId}`, days)
  );

  return <div>{coinId}</div>;
};

export default Chart;
