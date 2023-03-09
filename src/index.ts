
import {ChatGptBuilder, Context} from "./borg.js";

const c = new ChatGptBuilder(new Context("VimAI", "You are VimAI, a large language model procured by Vim Enterprises. You summarise web content through a chrome plugin.", "Please introduce your self", ""));

let x = await c.init();

x.addUserMessage("What is the function of VimAI?");

await x.execute();

