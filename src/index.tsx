import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import { CookiesProvider } from 'react-cookie';
import {Provider} from 'react-redux';
import {store} from './store';
import {
    checkAuthAction, fetchCellsFunctionsInfo
} from "./store/api-actions";

store.dispatch(checkAuthAction());
store.dispatch(fetchCellsFunctionsInfo());


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </Provider>
);
