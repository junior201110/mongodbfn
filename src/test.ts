import { ObjectId } from 'bson';
import { addConnection, closeClient, mongoFnCreator } from './index';

// todo database factor

const todoTransactions = mongoFnCreator({
    uri: '',
    dbName: 'MyDatabaseName'
})

interface TodoType {
    complete: boolean;
    title: string;
}



(async function listTodos() {
    await addConnection('mongodb://localhost:27017', 'MyDatabaseName');
    await todoTransactions<any>(
        'Todos',
        // do what you want to do
        ({ collection }) => collection.findOneAndUpdate({ _id: new ObjectId() }, { $set: { complete: false, title: 'teste' } }, { upsert: true })
    );
    const todos = await todoTransactions<TodoType[]>(
        'Todos',
        // do what you want to do
        ({ collection }) => collection.find({}).toArray()
    );
    console.log(todos.map((todo) => `${todo.title}: ${todo.complete ? 'complete' : 'incomplete'}`));
    await closeClient('MyDatabaseName')
    process.exit(0)
})()
