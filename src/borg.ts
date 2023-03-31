import {ChatCompletionRequestMessage, Configuration, CreateChatCompletionResponse, OpenAIApi} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Builder0<T> = Omit<_Builder<T>,
    "addUserMessage"
    // | "addSystemMessage"
    | "addAssistantMessage"
    | "execute"
    | "getResponses"
>;
type Builder1<T> = Omit<_Builder<T>, "init">;

class Context {
    botName: string;

    msgs: Array<ChatCompletionRequestMessage>;
    constructor(botName: string, systemMsg: string, userMsg: string, assistMsg: string) {
        this.botName = botName;
        this.msgs = [
            {
                role: "system", content: `You are ${botName}. ${systemMsg}`
            }
            , {
                role: "user", content: `${userMsg}`,
            }
            , {
                role: "assistant", content: `${assistMsg}`,
            }
        ];
    }
}

class _Builder<T> {
    private initMsg: Context;

    private context: Context;

    private initialised: Boolean = false;

    private responses: Array<CreateChatCompletionResponse>
    constructor(initMsg: Context) {
        this.initMsg = initMsg;
        this.context = new Context(this.initMsg.botName, initMsg.msgs[0].content, "", "");
        this.responses = [];
        return this;
    }

    async init(): Promise<Builder1<T>> {
        this.initialised = true;
        let res = await promptAndLog(this.initMsg.msgs);
        this.responses.push(res);
        return this;
    }

    async execute(): Promise<Builder1<T>> {
        this.checkInit();
        let res = await promptAndLog(this.context.msgs);
        this.responses.push(res);
        this.context = new Context(this.initMsg.botName, this.initMsg.msgs[0].content, "", "");
        this.responses.forEach((resp => {
            if (resp.choices[0].message) {
                this.context.msgs.push(resp.choices[0].message);
            }
        }))
        return this;
    }

    addUserMessage(msg: string): Builder0<T> {
        this.checkInit();
        this.context.msgs.push({ role: "user", content: msg});
        return this;
    }

    // addSystemMessage(msg: string): Builder0<T> {
    //     this.checkInit();
    //     this.context.msgs.push({ role: "system", content: msg});
    //     return this;
    // }

    addAssistantMessage(msg: string): Builder0<T> {
        this.checkInit();
        this.context.msgs.push({ role: "assistant", content: msg});
        return this;
    }

    getResponses(): Array<CreateChatCompletionResponse> {
        return this.responses;
    }

    private checkInit() {
        if (!this.initialised) {
            throw new Error("Not initialised");
        }
    }
}


async function promptAndLog(messages: Array<ChatCompletionRequestMessage>): Promise<CreateChatCompletionResponse> {
    const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: messages,
    });
    console.log("==================================================")
    console.log(completion.data.choices[0].message?.content || "");
    console.log("==================================================")
    return completion.data;
}

const Builder: new <T>(initMsg: Context) => Builder0<T> = _Builder;

export {Builder as ChatGptBuilder, Context};