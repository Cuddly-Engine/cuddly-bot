import { checkValidApiKey } from '../services/gwapi.service';
import fs from 'fs';

export const addApiKey = async (name, key) => {
    try {
        if (!await checkValidApiKey(key)) {
            return 'invalid key. If you feel the key is correct, check that the correct privilages have been ticked when creating it.';
        }

        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = await fs.readFileSync('./data/gwApiKeys.json');
        const file = JSON.parse(data);

        if (file.keys.some(el => el.name === name.toUpperCase()))
            return 'key already exists under that name.';

        if (file.keys.some(el => el.key === key))
            return 'key already exists with that API key.';

        // ? Needs to be done this way, you can mess with it if you want, but this is the way
        // writes new entry into keys array of the apikeys json object
        file.keys.push({ name: name.toUpperCase(), key });

        const json = JSON.stringify(file);

        // Rewrite json with updated keys.
        await fs.writeFileSync('./model/gwApiKeys.json', json);

        return 'success';

    } catch (error) {
        return 'Something went wrong, pls contact my master.';
    }
};

export const getApiKey = async (name) => {
    try {
        name = name.toUpperCase(); // entries are always uppercase 
        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = fs.readFileSync('./data/gwApiKeys.json', 'utf8');
        const file = JSON.parse(data);

        const key = file.keys.find(key => key.name === name);

        if (!key) {
            return {
                error: true,
                text: 'This name does not exist. Try again with a valid name :)',
            };
        }

        return {
            error: false,
            text: key,
        };

    } catch (error) {
        console.log(error);
        return {
            error: true,
            text: 'Something went wrong retreiving API keys D:',
        };
    }
};

export const checkApiKeyExists = async (key) => {
    try {
        const data = await fs.readFileSync('./data/gwApiKeys.json');
        const file = JSON.parse(data);

        if (file.keys.some(el => el.key === key))
            return 'key';

        if (file.keys.some(el => el.name === key.toUpperCase()))
            return 'name';
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const removeApiKeyByName = async (name) => {
    try {
        name = name.toUpperCase(); // entries are always uppercase 

        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = fs.readFileSync('./data/gwApiKeys.json', 'utf8');
        const file = JSON.parse(data);

        const json = JSON.stringify(file.keys.filter(key => key.name === name));
        // Rewrite json with updated keys.
        await fs.writeFileSync('./model/gwApiKeys.json', json);

        return 'apikey successfully deleted.';

    } catch (err) {
        console.log(err);
        return 'unable to save to key storage. something is wrong pls contact my master.';
    }
};

export const removeApiKeyByKey = async (apiKey) => {
    try {
        // Gets fresh copy of apikeys document so it can be updated and replaced.
        const data = fs.readFileSync('./data/gwApiKeys.json', 'utf8');
        const file = JSON.parse(data);
        // Converting into array object so i can get the names of each key
        const json = JSON.stringify(file.keys.filter(key => key.key === apiKey));

        // Rewrite json with updated keys.
        await fs.writeFileSync('./model/gwApiKeys.json', json);

        return 'Key successfully deleted!';

    } catch (err) {
        console.log(err);
        return 'unable to delete key. something is wrong pls contact my master.';
    }
};