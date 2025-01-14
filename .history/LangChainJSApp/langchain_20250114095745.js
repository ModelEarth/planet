// import { ChatOpenAI } from "@langchain/openai";
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// const model = new ChatOpenAI({ model: "gpt-4" });
// const messages = [
//   new SystemMessage("Translate the following from English into Italian"),
//   new HumanMessage("hi!"),
// ];

// await model.invoke(messages);


import { ChatOpenAI } from "@langchain/openai";
// import { HuggingFaceInference } from "langchain/tools";
import { HuggingFaceInference } from "langchain/integrations/huggingface";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function initializeModel(apiKey, modelType = "openai") {
    if (modelType === "huggingface") {
        return new HuggingFaceInference({
            apiKey,
            model: "distilgpt2", 
        });
    } else {
        return new ChatOpenAI({
            openAIApiKey: apiKey,
            modelName: "gpt-4",
            temperature: 0,
        });
    }
}

export async function processMessages(apiKey, query, modelType = "openai") {
    const model = await initializeModel(apiKey, modelType);
    const messages = [
        new SystemMessage("Translate the following from English into Italian"),
        new HumanMessage(query),
    ];

    const response = await model.invoke(messages);
    console.log("Response:", response);
    return response;
}