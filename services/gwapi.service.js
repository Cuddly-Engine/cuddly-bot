// @ts-check
import axios from 'axios';
const baseUrl = 'https://api.guildwars2.com/';
let config = { headers: { Authorization: 'Bearer 35B1755B-573D-3D49-9577-9E71BF9B7B28E6BEBD78-7A29-4053-AEC3-63C422B5F0FC' } }

export const getWorldBosses = async () => {
    try {
        const response = await axios.get(baseUrl + `v2/worldbosses`);

        return response;
    } catch (error) {
        return error;
    }
};

export const getBankAmount = async (info) => {
    try {
        const response = await axios.get(baseUrl + `/v2/account/wallet`, config);

        return response.data;
    } catch (error) {
        return error;
    }
};


export const getCurrencyType = async (id) => {
    try {

        const response = await axios.get(baseUrl + `/v2/currencies?ids=all`);
        
        return response.data;
    } catch (error) {
        return error;
    }
};