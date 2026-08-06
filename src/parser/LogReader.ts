import axios from "axios";

export class LogReader {

    static async read(url: string): Promise<string> {

        const response = await axios.get(url);

        return response.data;

    }

}