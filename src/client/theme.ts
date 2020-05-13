import 'styled-components';
import { createMuiTheme } from '@material-ui/core';

// 下記Theme入力時の補完を効かせるため。とりあえずは、下記の設定でいく。
export const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      root: {
        backgroundColor: '#fff',
        '&$disabled': {
          backgroundColor: '#fafafa',
          color: '#000',
        },
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: '#fff',
        '&$disabled': {
          backgroundColor: '#fafafa',
          color: '#000',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: '#fff',
      },
    },
  },
  /*
  palette: {
    primary: {
      light: '#e8757c',
      main: '#b53f50',
      dark: '#840028',
      contrastText: '#fff',
    },
    secondary: {
      light: '#61ff79',
      main: '#36f443',
      dark: '#0dba00',
      contrastText: '#000',
    },
  },
  */
});
