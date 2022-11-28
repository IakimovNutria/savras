export default async function getSharedPipelines() {
    try {
        return fetch('http://178.250.246.144:8000/api/v1/pipelines/shared', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
            },
            credentials: 'include'
        });
    } catch (error) {
        return null;
    }
}
