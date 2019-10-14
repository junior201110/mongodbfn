import { mongoFnCreator } from './index'

// todo database factor

const todoTransactions = mongoFnCreator({
    uri: 'mongodb://localhost:27017',
    dbName: 'MyDatabaseName'
})

interface TodoType {
    complete: boolean;
    title: string;
}



(async function listTodos() {
    const todos = await todoTransactions<TodoType[]>(
        'Todos',
        // do what you want to do
        ({ collection }) => collection.find({}).toArray()
    );
    console.log(todos.map((todo) => `${todo.title}: ${todo.complete ? 'complete' : 'incomplete'}`))
})()
