import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { reducer as dataReducer } from './stateManagements/Reducer';

import { Provider } from 'react-redux';


const rootReducer = combineReducers({
  data: dataReducer
});


export const store = createStore(rootReducer, applyMiddleware(thunk));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <Provider store={store}>
        <App />
      </Provider>,
     document.getElementById('root')
);
