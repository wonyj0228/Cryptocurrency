import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  textColor: 'black',
  accentColor: '#163E64',
  redColor: '#E12343',
  blueColor: '#1763B6',
  bgColor: 'white',
  grayColor: '#F8F8F9',

  borderColor: '1px solid rgb(80, 80, 80, 0.5)',
  tableHeadTextColor: `rgba(0, 0, 0, 0.4)`,
  tableBodyBgColor: 'white',
  trBorderColor: '0.7px solid rgba(80, 80, 80, 0.1)',
  trHoverColor: 'rgba(80, 80, 80, 0.1)',

  themeSunColor: 'white',
  themeMoonColor: 'gray',
};

export const darkTheme: DefaultTheme = {
  textColor: 'white',
  accentColor: '#1772FA',
  redColor: '#FF0000',
  blueColor: '#4E95D9',
  bgColor: '#252C36',
  grayColor: '#363C47',

  borderColor: '1px solid #BFBFBF',
  tableHeadTextColor: `rgba(255, 255, 255, 0.7)`,
  tableBodyBgColor: '#363C47',
  trBorderColor: '0.7px solid rgba(187, 187, 187, 0.5)',
  trHoverColor: 'rgba(210, 210, 210, 0.5)',

  themeSunColor: '#6B768D',
  themeMoonColor: 'white',
};
