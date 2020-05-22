import { checkApiKeyExists } from '../services/gwapi.service';
import fs from 'fs';

export const addApiKey = async (name, key) => {
    try {
        if (!await checkApiKeyExists('Bearer ' + key)) {
            return 'invalid key. If you feel the key is correct, check that the correct privilages have been ticked when creating it.';
        }

        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = await fs.readFileSync('./model/gwApiKeys.json');
        const file = JSON.parse(data);

        if (file.keys[name.toUpperCase()])
            return 'key already exists under that name.';

        // ? Needs to be done this way, you can mess with it if you want, but this is the way
        // writes new entry into keys array of the apikeys json object
        file.keys[name.toUpperCase()] = key; // Storing bearer with key so i never have to write it 

        const json = JSON.stringify(file);

        // Rewrite json with updated keys.
        await fs.writeFileSync('./model/gwApiKeys.json', json, (err) => {
            if (err) {
                return 'unable to save to key storage. something is wrong pls contact my master.';
            }
        });

        return 'success';

    } catch (error) {
        return 'Something went wrong';
    }
};

export const getApiKey = async (name) => {
    try {
        name = name.toUpperCase(); // entries are always uppercase 
        let response = { error: false, text: '' };
        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = fs.readFileSync('./model/gwApiKeys.json', 'utf8');
        const file = JSON.parse(data);

        if (!file.keys[name]) {
            response.error = true;
            response.text = 'This name does not exist. Try again with a valid name :) ';
        } else {
            response.text = file.keys[name];
        }

        return response;

    } catch (error) {
        return error;
    }
};

export const removeApiKeyByName = async (name) => {
    try {
        name = name.toUpperCase(); // entries are always uppercase 
 
        let response = { error: false, text: '' };
        // Gets fresh copy of apikeys document so it can be updated and replaced.

        const data = fs.readFileSync('./model/gwApiKeys.json', 'utf8');
        const file = JSON.parse(data);
        if (file.keys[name]) {
            delete file.keys[name];

        const json = JSON.stringify(file);

        // Rewrite json with updated keys.
        await fs.writeFileSync('./model/gwApiKeys.json', json, (err) => {
            if (err) {
                response.error = true;
                response.text = 'unable to save to key storage. something is wrong pls contact my master.';
                return response;
            } 
        });
        } else {
            response.error = true;
            response.text = 'there is no apikey associated with that name.';
            return response;
        }

        if(!response.error)
            response.text = 'apikey successfully deleted.';
        
            
        return response;

    } catch (error) {
        return error;
    }
};

export const removeApiKeyByKey = async (key) => {
    try {
        let response = { error: false, text: '' };
        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = fs.readFileSync('./model/gwApiKeys.json', 'utf8');
        const file = JSON.parse(data);
        // Converting into array object so i can get the names of each key
        const keys = Object.keys(file.keys);
        // Keeping track of keys deleted to tell the user.
        const keysDeleted = [];
        
        for(let i = 0; i< keys.length; i++) {
            // using names of each key as indexes, if equal to key given, DELETE
            if(file.keys[keys[i]] === key) {
                keysDeleted.push(keys[i]);
                delete file.keys[keys[i]];
            }
        }

        const json = JSON.stringify(file);

        // Rewrite json with updated keys.
        await fs.writeFileSync('./model/gwApiKeys.json', json, (err) => {
            if (err) {
                response.error = true;
                response.text = 'unable to save to key storage. something is wrong pls contact my master.';
                return response;
            } 
        });

        if(keysDeleted.length === 0) {
            response.error = true;
            response.text = 'No entries exist with the given key.';
            return response;
        }
        
        response.text = 'Keys deleted: ' + keysDeleted.toString();

        return response;

    } catch (error) {
        return error;
    }
};