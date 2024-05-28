import { RouterProvider } from 'react-router-dom';
import Router from './Router';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useState, createContext } from 'react';
import { darkTheme, lightTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  ${reset}

  *{
    box-sizing: border-box;
  }
  body{
    font-family: 'Noto Sans',"Noto Sans KR", sans-serif;
    font-size: 16px;
  }
  a{
    text-decoration: none;
    color: inherit;
  }
`;

export const ThemeContext = createContext({ setTheme: () => {}, theme: '' });

function App() {
  const [theme, setTheme] = useState('light');

  const changeTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  return (
    <>
      <ThemeContext.Provider value={{ setTheme: changeTheme, theme: theme }}>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <GlobalStyle />
          <RouterProvider router={Router()} />
          <ReactQueryDevtools initialIsOpen={true} />
        </ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
