// @ts-check

import axios from 'axios';

export class gw2 {
    

    constructor() {
        this.url = 'https://dog.ceo/api/';
    }

    async getBreeds() {
            try {
                let response = await axios.get(this.url + 'breeds/image/random');

                return response.data.message;

            } catch (error) {           
               return error;
            }
    }
}
