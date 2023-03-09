import express, { Express, Request, Response } from 'express';
import {ChatGptBuilder, chatGptFrom, Context} from "./borg.js";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const pass = process.env.PASS;
app.use(express.json());

const db = new Map<string, Context>();

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
        const context = db.get(newQuery.session_key);
        let chat;
        if (context) {
            chat = chatGptFrom(context);
        } else {
            const chatGPTClient = new ChatGptBuilder(new Context("VimAI", "You are VimAI, a large language model procured by Vim Enterprises. You summarise web content through a chrome plugin.", "Please introduce your self", ""));
            chat = await chatGPTClient.init();
        }
        chat.addUserMessage(newQuery.content);
        await chat.execute();
        db.set(newQuery.session_key, chat.getContext());
        //console.log(chat.getResponses());
        res.status(201).send(chat.getResponses()[chat.getResponses().length - 1]);
    } catch (error) {
        console.error('Error answering query:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Summarise API is running at http://localhost:${port}`);
});