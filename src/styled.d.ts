import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    accentColor: string;
    redColor: string;
    blueColor: string;
    bgColor: string;
    grayColor: string;

    themeSunColor: string;
    themeMoonColor: string;
  }
}
