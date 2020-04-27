import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AppWithContext from './AppWithContext'
import AppWithUseContext from './AppWithUseContext'
import AppWithComposition from './AppWithComposition'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <AppWithComposition />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
