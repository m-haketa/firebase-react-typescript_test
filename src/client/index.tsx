import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider as MaterialThemeProvider } from '@material-ui/styles';
import {
  ThemeProvider as StyledThemeProvider,
  DefaultTheme,
} from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from '@client/theme';

import { App } from '@client/App';

import './style.css';

const Index: React.FC = () => {
  return (
    <MaterialThemeProvider theme={theme}>
      <StyledThemeProvider theme={theme as DefaultTheme}>
        <CssBaseline />
        <App />
      </StyledThemeProvider>
    </MaterialThemeProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('index'));
