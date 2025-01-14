import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { HfInference } from "@huggingface/inference";

let files = [];

// Parse Git URL
function parseGitHubUrl(sourceUrl) {
    if (!sourceUrl.startsWith("https://github.com/")) {
        throw new Error("Invalid GitHub URL. It must start with 'https://github.com/'.");
    }
    const parts = sourceUrl.replace("https://github.com/", "").split("/");
    if (parts.length < 2) {
        throw new Error("Invalid GitHub URL. It must include both owner and repository name.");
    }
    return { owner: parts[0], repo: parts[1] };
}

async function fetchFilesFromRepo(owner, repo, path = "", githubToken, depth = 0) {
    const maxDepth = 10; 
    if (depth > maxDepth) {
        console.warn(`Reached max depth (${maxDepth}) at path: ${path}`);
        return;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `Bearer ${githubToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }

        const json = await response.json();
        for (const item of json) {
            if (item.type === "file") {
                files.push(item);
            } else if (item.type === "dir") {
                await fetchFilesFromRepo(owner, repo, item.path, githubToken, depth + 1);
            }
        }
    } catch (e) {
        console.error(`Error fetching from path ${path}:`, e);
        throw e;
    }
}

// User Input
export async function processMessages(apiKey, query, provider) {
    if (provider === "huggingface") {
        const hf = new HfInference(apiKey);
        try {
            const response = await hf.textGeneration({
                model: "gpt2", // replace with the Hugging Face model
                inputs: query,
            });
            console.log("Hugging Face Response:", response);
            return response.generated_text;
        } catch (error) {
            console.error("Error from Hugging Face:", error);
            throw error;
        }
    } else if (provider === "openai") {
        const model = new ChatOpenAI({
            openAIApiKey: apiKey,
            modelName: "gpt-4",
        });

        const messages = [
            { role: "system", content: "Answer the following query:" },
            { role: "user", content: query },
        ];

        const response = await model.call(messages);
        return response.content;
    } else {
        throw new Error("Unknown provider. Supported providers are 'openai' and 'huggingface'.");
    }
}

export async function pullFromRepo() {
    files = [];
    const sourceUrl = document.getElementById("sourceUrl").value;
    const githubToken = document.getElementById("githubToken").value;
    const apiKey = document.getElementById("apiKey").value;

    if (!sourceUrl || !apiKey) {
        document.getElementById("response").textContent = "Error: Please provide both GitHub URL and API Key.";
        return;
    }

    const { owner, repo } = parseGitHubUrl(sourceUrl);
    const isHuggingFace = apiKey.startsWith("hf_");

    try {
        // Step 1: Load files from GitHub
        await fetchFilesFromRepo(owner, repo, "", githubToken);
        console.log("Files:", files);

        // Step 2: Process query using selected model
        const query = document.getElementById("userQuery").value;
        const response = await processMessages(apiKey, query, isHuggingFace ? "huggingface" : "openai");
        document.getElementById("response").textContent = response;
    } catch (e) {
        console.error("Error:", e);
        document.getElementById("response").textContent = `Error: ${e.message}`;
    }
}

export async function loadAndProcessDocuments() {
    const sourceType = document.getElementById("sourceType").value;
    const sourceUrl = document.getElementById("sourceUrl").value;
    const githubToken = document.getElementById("githubToken").value;

    try {
        if (!sourceUrl) {
            throw new Error("Source URL is required.");
        }

        const { owner, repo } = parseGitHubUrl(sourceUrl);

        if (sourceType === "repo") {
            await fetchFilesFromRepo(owner, repo, "", githubToken);
            const documents = files.map(file => ({
                pageContent: file.name,
                metadata: { path: file.path },
            }));

            console.log("Loaded documents:", documents);
            document.getElementById("loadStatus").textContent = `Loaded ${documents.length} documents.`;
        } else {
            document.getElementById("loadStatus").textContent = "Currently only 'Entire Repository' is supported.";
        }
    } catch (e) {
        console.error("Error loading documents:", e);
        document.getElementById("loadStatus").textContent = `Error: ${e.message}`;
    }
}