// @ts-check
import axios from 'axios';
const baseUrl = 'https://api.guildwars2.com'

export const getWorldBosses = async () => {
    try {
        const response = await axios.get(`https://api.guildwars2.com/v2/worldbosses`);
        console.log(response);
   //     console.log(response);
        
        return response;
    } catch (error) {
        return error;
    }
};
