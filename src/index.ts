import { MongoClient, FilterQuery, Db, Collection, MongoClientOptions } from "mongodb";

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
export function closeClient(client: MongoClient) {
    client.close();
}
const connections: { [dbName: string]: MongoClient } = {};

export function getClient(dbName: string, uri: string, options?: MongoClientOptions): MongoClient {
    if (connections[dbName]) {
        return connections[dbName];
    }
    connections[dbName] = new MongoClient(uri, { useNewUrlParser: true, ...options });
    return connections[dbName];
}

export function mongoFnCreator({ dbName, uri, clientOptions }: ActionCreatorParams) {
    return async <TResult>(collectionName: string, executor: (params: ActionCreateCallbackParams) => Promise<TResult>) => {
        const client = getClient(dbName, uri, clientOptions);
        await client.connect();
        const db = client.db(dbName);
        return await executor({ db, collection: db.collection(collectionName) });
        // closeClient(client);

    }
};