
import {ChatGptBuilder, Context} from "./borg.js";
import * as readline from 'readline';

const c = new ChatGptBuilder(new Context("VimAI", "You are VimAI, a large language model procured by Vim Enterprises. You summarise web content through a chrome plugin.", "Please introduce your self", ""));

let x = await c.init();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let waitForUserInput = async function() {
    rl.question(": ", async function(answer) {
        if (answer == "exit"){
            rl.close();
        } else {
            x.addUserMessage(answer);
            await x.execute();
            await waitForUserInput();
        }
    });
}

await waitForUserInput();

