// @ts-check
import axios from 'axios';
const baseUrl = 'https://api.guildwars2.com/';

// For when people put in fake api keys to break system :) 
export const checkValidApiKey = async (key) => {
    try {
        // Dummy request. doesn't matter what it is as long as it uses api key. 
        await axios.get(`${baseUrl}/v2/account/wallet`, { headers: { Authorization: 'Bearer ' + key } });

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
        const response = await axios.get(`${baseUrl}/v2/account/wallet`, { headers: { Authorization: 'Bearer ' + key } });
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

export const getDailys = async () => {
    try {

        const response = await axios.get(`${baseUrl}/v2/achievements/daily`);

        return response.data;
    } catch (error) {
        return error;
    }
};

export const getQuaggans = async () => {
    try {

        const response = await axios.get(`${baseUrl}/v2/quaggans`);

        return response.data;
    } catch (error) {
        return error;
    }
};

export const getQuaggan = async (quag) => {
    try {

        const response = await axios.get(`${baseUrl}/v2/quaggans/${quag}`);

        return response.data;
    } catch (error) {
        return error;
    }
};

export const getDailyDetails = async (ids) => {
    try {

        const response = await axios.get(`${baseUrl}/v2/achievements?ids=${ids}`);

        return response.data;
    } catch (error) {
        return error;
    }
};
