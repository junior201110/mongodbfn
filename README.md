# MongoDB Function Module

The main idea from this project is simplify mongodb database transactions. 
We are excited for use function programing principles to create an wrapper that include
a mongodb instance and a mongodb collection instance. You can use this module to make all 
CRUD actions and all of top level mongodb api [see more](https://docs.mongodb.com/)

This module is perfect for cloud functions servers, because it dont use a static instance of mongodb client. 

In all transactions, it open a mongodb connection, await for a  callback (configured by you), close mongodb connection and return the callback result. 



# How use

This is a quick and simple example that show you how thats work. In this example we are going to list all todos in Todos collection.



```typescript

import { mongoFnCreator } from 'mongodbfn'

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
    console.log(todos.map((todo) => `${todo.title}: ${todo.complete ? 'complete' :  'incomplete'}`))
})()



```

