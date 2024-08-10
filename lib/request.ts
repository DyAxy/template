import axios from "axios";
import config from '@/config';

const request = axios.create({
    baseURL: `${config.apiUrl}api/v1/`,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const fetcher = (url: string) => axios.get(`/api?scheme=${url}`).then(res => res.data.data)
export const fetchData = async (url: string) => {
    try {
        return await axios.get(`/api?scheme=${url}`)
    } catch (e) {
        throw e
    }
}
export default request;