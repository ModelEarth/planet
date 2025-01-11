import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
let files = [];

async function fetchFilesFromRepo(owner, repo, path="", githubToken){
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    try{
        const response = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `Bearer ${githubToken}`
            },
        });
        if(!response.ok){
            throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }
        const json = await response.json();
        for(const item of json){
            if(item.type === 'file'){
                files.push(item);
            } else if(item.type === 'dir'){
                await fetchFilesFromRepo(owner, repo, item.path, githubToken);
            }
        }
    } catch(e){
        console.error(`Error fetching from path ${path}:`, e);
    }
}
export async function pullFromRepo(){
    files = [];
    const owner = 'djsurt';
    const repo = 'localsite';
    const path = "";
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    const githubToken = document.getElementById('githubToken').value;

    try{
        await fetchFilesFromRepo(owner, repo, "", githubToken);
        console.log("Files:", files);
    } catch(e){
        console.error("Error fetching files:", e);
    }
    // at this point, we have all the files from the repo. Now we need to feed it to the RAG model
    
    const apiKey = document.getElementById('apiKey').value;
    const llm = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0
    });
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large"
    });
    const vectorStore = new MemoryVectorStore(embeddings);

}