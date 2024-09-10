import axios from "axios";

const request = axios.create({
    baseURL: `${process.env.API_URL}api/v1/`,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const fetcher = (url: string) => axios.get(`${url}`).then(res => res.data)

export default request;