import type { Schema } from "../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data';

import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const getLinkCount = async (userid: string) =>  {

    const {data , errors} = await client.models.Link.listLinkByUserId({
      userId: userid
    })
  
    if(errors){
      console.log(errors,"getLinkCountERROR")
    }
  
    const count = data.length
  
    return count;
};