import { RouterProvider } from 'react-router-dom';
import Router from './Router';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
  return (
    <>
      <RouterProvider router={Router()} />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
