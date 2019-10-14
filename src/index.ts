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

export function getClient(uri: string, options?: MongoClientOptions): MongoClient {
    return new MongoClient(uri, { useNewUrlParser: true, ...options });
}

export function mongoFnCreator({ dbName, uri, clientOptions }: ActionCreatorParams) {
    ///cb: (params: ActionCreateCallbackParams) => Promise<TResult>
    return async <TResult>(collectionName: string, executor: (params: ActionCreateCallbackParams) => Promise<TResult>) => {
        const client = getClient(uri, clientOptions);
        await client.connect();
        const db = client.db(dbName);
        const result = await executor({ db, collection: db.collection(collectionName) });
        closeClient(client);
        return result;
    }
};