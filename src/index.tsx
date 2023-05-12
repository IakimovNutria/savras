import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import App from './components/app/app';
import { store } from './store';
import { fetchCellsFunctionsInfo } from './store/main-reducer/actions';
import {BrowserRouter} from 'react-router-dom';

store.dispatch(fetchCellsFunctionsInfo());

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
	<Provider store={store}>
		<CookiesProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</CookiesProvider>
	</Provider>,
);
