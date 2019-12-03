import { MongoClient, Db, Collection, MongoClientOptions } from "mongodb";

export interface ActionCreateCallbackParams {
    db: Db;
    collection: Collection;
}

export interface ActionCreatorParams {
    collectionName?: string;
    dbName: string;
    uri: string;
    clientOptions?: MongoClientOptions;

}
const instances: { [uri: string]: MongoClient } = {};


export function addConnection(uri: string, dbName: string, clientOptions?: MongoClientOptions): Promise<MongoClient> {
    return new Promise((resolve) => {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 2 * 60 * 60 * 1000,
            socketTimeoutMS: 2 * 60 * 60 * 1000,
            ...clientOptions
        });
        client.connect(async (err, _client) => {
            if (err) {
                console.log("Connection error");
                throw err;
            }

            console.log("Connected successfully to server " + uri);

            instances[dbName] = client;
            resolve(client);
        });
    })
}
// const dbInstances = {};
export async function connect<TResult>(dbName: string, collectionName: string, cb: (params: ActionCreateCallbackParams) => Promise<TResult>): Promise<TResult> {

    const _client = instances[dbName];
    if (!_client) {
        throw new Error('Has no instance for ' + dbName)
    }
    const db = _client.db(dbName);
    return await cb({ db, collection: db.collection(collectionName) });
}
async function getClient<TResult = any>(dbName: string, collectionName: string, cb: (params: ActionCreateCallbackParams) => Promise<TResult>): Promise<TResult> {


    try {
        return await connect<TResult>(dbName, collectionName, cb);
    } catch (e) {
        console.log("CLIENT NOT CONNECTED")
        throw e;
    }



}
export interface ActionCreateCallbackParams {
    db: Db;
    collection: Collection;

}

export function closeClient(dbName: string) {

    if (!instances[dbName]) {
        return null;
    }

    instances[dbName].close();

}
// export async function actionCreator<TResult = any>({ collectionName, dbName }: ActionCreatorParams, cb: (params: ActionCreateCallbackParams) => Promise<TResult>): Promise<TResult> {
//     return await getClient<TResult>(dbName || 'pedidosOnline', collectionName, cb);
// }

export function mongoFnCreator({ dbName, uri }: ActionCreatorParams) {
    if (uri) {
        console.warn("URI IS DEPRECATED, USE addConnection");
    }
    return async <TResult>(collectionName: string, executor: (params: ActionCreateCallbackParams) => Promise<TResult>) => {
        return await getClient<TResult>(dbName || 'test', collectionName, executor);

        // const db = client.db(dbName);
        // return await executor({ db, collection: db.collection(collectionName) });
        // closeClient(client);

    }
};