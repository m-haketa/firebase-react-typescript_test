import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '@client/App';

const Index: React.FC = () => {
  return <App />;
};

ReactDOM.render(<Index />, document.getElementById('index'));
