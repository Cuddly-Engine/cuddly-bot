// @ts-check
import axios from 'axios';

const url = 'https://dog.ceo/api/';

export const getWorldBosses = async () => {
    try {
        const response = await axios.get(`${url}breeds/image/random`);
        return response.data.message;
    } catch (error) {
        return error;
    }
};
