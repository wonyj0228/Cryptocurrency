import { createBrowserRouter } from 'react-router-dom';
import Coins from './routes/Coins';
import Coin from './routes/Coin';
import Chart from './routes/Chart';

function Router() {
  return createBrowserRouter([
    { path: '/', element: <Coins /> },
    {
      path: '/:coinId',
      element: <Coin />,
      children: [{ path: 'chart', element: <Chart /> }],
    },
  ]);
}

export default Router;
