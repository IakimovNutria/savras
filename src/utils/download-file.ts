import {saveAs} from 'file-saver';
import {createAPI} from '../services/api';

export const downloadFile = (path: string, name: string) => {
	const api = createAPI();
	api.get('/files-section/download', { params: { path }, responseType: 'blob' })
		.then((r) => saveAs(r.data, name));
};
