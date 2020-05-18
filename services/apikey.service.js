import { checkApiKeyExists } from '../services/gwapi.service';
import { fs } from 'file-system';

export const addApiKey = async (name, key) => {
    try {

        let response = 'success';

        if(!await checkApiKeyExists('Bearer ' + key)) {
            response = 'invalid key. If you feel the key is correct, check that the correct privilages have been ticked when creating it.'; 
        }
        
        // Gets fresh copy of apikeys document so it can be updated and replaced.

        fs.readFile('./model/gwApiKeys.json', 'utf8',  (err, data) => {
            
            if (err) {
                response = 'unable to get key storage. something is wrong pls contact my master.';
            } else {
                const file = JSON.parse(data);
                
                if(file.keys[name])
                    response = 'key already exists under that name.';


                    console.log(response)
                // ? Needs to be done this way, you can mess with it if you want, but this is the way
                // writes new entry into keys array of the apikeys json object
                var tmpObj = {};
                tmpObj[name] = key;
                file.keys[name] = key;

                const json = JSON.stringify(file);

                // Rewrite json with updated keys.
                fs.writeFile('./model/gwApiKeys.json', json, 'utf8', (err) => {
                    if(err){ 
                        response = 'unable to save to key storage. something is wrong pls contact my master.';
                }});
            }       
        });

         console.log(response)
         return response;

    } catch (error) {
        return error;
    }
};
