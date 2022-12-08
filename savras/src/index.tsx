import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../../savras/src/components/app/app';
import { CookiesProvider } from 'react-cookie';
import {Provider} from 'react-redux';
import {store} from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </Provider>
);
