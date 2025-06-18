# Planet Langchain

View our [interface development](trade) - view in [website](https://model.earth/planet/langchain/trade/) 
Click: Document Source > Feed API

Install dependencies, including vite, into the node_modules folder:

	npm install

To build to trade folder, run:

	npm run build

View in your webroot. [Cmd to turn on your webroot](https://dreamstudio.com/localsite/start/steps/).

Layout resides in layout.html

The [trade folder](trade/) is the dist (built) output, so avoid making edits in trade.

### Projects

Here's a [test embed page](test-embed.html) (thanks priyanka!) for debugging embedding.  

TO DO: When embedding, there's currently an error:  

	Uncaught TypeError: Failed to resolve module specifier "langchain/vectorstores/memory".  
	Relative references must start with either "/", "./", or "../".


That error means layout.js is trying to import a bare module specifier ("langchain/vectorstores/memory"), which only works in a bundler-aware environment (like Vite, Webpack, or Node's module resolver). Browsers don't know how to resolve "langchain/..." unless it's explicitly hosted or rewritten.

From [chatGPT](https://chatgpt.com/share/6807b2e2-ed38-8003-be2e-361664a64e70) - Offers steps for creating layout.bundle.js that didn't work yet.

<!--

Our npm project (attached) builds to a folder called trade.
We have a test-embed.html page designed to load the resulting single page app as a widget.

When embedding, there's currently an error in the test-embed.html page:

Uncaught TypeError: Failed to resolve module specifier "langchain/vectorstores/memory".  
Relative references must start with either "/", "./", or "../".

-->