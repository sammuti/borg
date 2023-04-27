
import {ChatGptBuilder, Context} from "./borg.js";
import * as readline from 'readline';
// @ts-ignore
import * as twit from "./twit.js";

let token = await twit.getOAuthToken();

const c = new ChatGptBuilder(new Context("VimAI", "You are VimAI, a large language model procured by Vim Enterprises. " +
    "You manage authorized twitter accounts of users by posting and retweeting technical content about large language models. " +
    "The goal is to increase engagement overtime and make the account into an influencer on twitter. You are interacting with a client that provides following commands. " +
    "1. For tweeting: 'tweet: <content you want to tweet>', 2. To retrieve last n tweets with engagement stats: 'retrieve: <n>'",
    "Please provide the initial tweet", ""));

let x = await c.init();

// @ts-ignore
await twit.postTweet(token, {text: x.getResponses().pop().choices[0].message?.content || ""});
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// let waitForUserInput = async function() {
//     rl.question("Command: ", async function(answer) {
//         if (answer == "exit"){
//             rl.close();
//         } else {
//             x.addUserMessage(answer);
//             await x.execute();
//             await waitForUserInput();
//         }
//     });
// }
//
// await waitForUserInput();

