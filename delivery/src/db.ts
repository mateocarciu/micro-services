import { connect } from "mongoose"
import {myEnv} from '../conf'

const CONNECTION_STRING = `mongodb+srv://cedricdsst:C9STiOiaJQYv8j3I@cluster0.7oiduv6.mongodb.net/micro-service-delivery?retryWrites=true&w=majority&appName=Cluster0`

// if(myEnv.MONGOOSE_DEBUG==='true') mongoose.set('debug', false);

export async function DbConnect(){
    try {    
        // _declareMongoEvents()
        const _db =  await connect(CONNECTION_STRING)
        console.log(`🟢 connected to Atlas Cluster: ${myEnv.MONGODB_CLUSTER}`);
        return _db
    } catch (e) {
        console.warn((e as any).errorResponse)
        return e;
    }
}

