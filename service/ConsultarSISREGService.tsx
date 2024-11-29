import axios from "axios";
import qs from "qs";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API_ONIX,
});

export class ConsultarSISREG {
    url: string;

    constructor() {
        this.url = "/consultar-status";
    }

    consultar(objeto: any) {
        const data = qs.stringify(objeto); // Converte o objeto para x-www-form-urlencoded
        return axiosInstance.post(this.url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    }
}
