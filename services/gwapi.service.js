// @ts-check
import axios from 'axios';
const baseUrl = 'https://api.guildwars2.com/';

// For when people put in fake api keys to break system :) 
export const checkApiKeyExists = async (key) => {
    try {

        // Dummy request. doesn't matter what it is as long as it uses api key. 
        const response = await axios.get(`${baseUrl}/v2/account/wallet`, { headers: { Authorization: key } });

        return true;
    } catch (error) {
        if (error.response.statusText === 'Unauthorized')
            return false;
    }
};

export const getWorldBosses = async () => {
    try {
        const response = await axios.get(`${baseUrl}v2/worldbosses`);

        return response;
    } catch (error) {
        return error;
    }
};

export const getBankAmount = async (key) => {
    try {
        console.log(key);

        const response = await axios.get(`${baseUrl}/v2/account/wallet`, { headers: { Authorization: key } });
        return response.data;
    } catch (error) {
        return error;
    }
};


export const getCurrencyType = async () => {
    try {

        const response = await axios.get(`${baseUrl}/v2/currencies?ids=all`);

        return response.data;
    } catch (error) {
        return error;
    }
};