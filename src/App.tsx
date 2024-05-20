import { RouterProvider } from 'react-router-dom';
import Router from './Router';
import { ReactQueryDevtools } from 'react-query/devtools';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
  
  body{
    font-family: 'Noto Sans', sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={Router()} />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
  );
}

export default App;
