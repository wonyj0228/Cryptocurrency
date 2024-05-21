import { RouterProvider } from 'react-router-dom';
import Router from './Router';
import { ReactQueryDevtools } from 'react-query/devtools';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  *{
    box-sizing: border-box;
  }
  
  body{
    font-family: 'Noto Sans',"Noto Sans KR", sans-serif;
    font-size: 16px;
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
