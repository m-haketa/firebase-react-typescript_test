import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '@client/App';

const Root: React.FC = () => {
  return <App />;
};

ReactDOM.render(<Root />, document.getElementById('index'));
