import express, { Express, Request, Response } from 'express';
import {ChatGptBuilder, Context} from "./borg.js";
import dotenv from 'dotenv';

const chatGPTClient = new ChatGptBuilder(new Context("VimAI", "You are VimAI, a large language model procured by Vim Enterprises. You summarise web content through a chrome plugin.", "Please introduce your self", ""));
let chat = await chatGPTClient.init();

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const pass = process.env.PASS;
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Summarise!!!');
});


interface Query {
    content: string;

    session_key: string;

    pass: string;
}

app.post('/query', async (req: Request, res: Response) => {
    try {
        const newQuery: Query = req.body;
        if (pass !== newQuery.pass) {
            res.status(401).send("unauthorised");
            return;
        }
        // Here you can validate and/or process the user data as needed
        console.log('Received new user:', newQuery);
        chat.addUserMessage(newQuery.content);
        await chat.execute();
        // Here you can use async/await to save the user to a database or perform other asynchronous tasks
        // ...
        res.status(201).send(chat.getResponses()[0]);
    } catch (error) {
        console.error('Error answering query:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Summarise API is running at http://localhost:${port}`);
});