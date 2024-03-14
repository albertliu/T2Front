import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/AppContainers';
import './index.css';
import { Provider } from 'react-redux'
import store from './modules/store'
import { HashRouter } from 'react-router-dom'

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('root')
);