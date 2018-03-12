// This file creates an Express server and mounts the agent on it.

import fs from 'fs';
import crypto from 'crypto';
import express from 'express';
import Agent from '@indigoframework/agent';

const { plugins } = Agent;

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
const storeHttpClient = Agent.storeHttpClient(
  process.env.STRATUMN_STORE_URL || 'http://store:5000'
);

const fossilizerHttpClients = [];

// Create an agent.
const agentUrl = process.env.STRATUMN_AGENT_URL || 'http://agent:3000';
const agent = Agent.create({
  agentUrl: agentUrl
});

// List of plugins used for our process actions
const processPlugins = [plugins.agentUrl(agentUrl), plugins.actionArgs, plugins.stateHash, plugins.agentVersion];

// Load process actions.
// Assumes your action files are in ./lib/actions and export a 'name' field.
fs.readdir('./lib/actions', (err, processFiles) => {
  if (err) {
    console.error(`Cannot load process actions: ${err}`);
    return;
  }

  processFiles.forEach(file => {
    const actions = require(`./lib/actions/${file}`).default;
    if (!actions.name) {
      console.log(`Process ${file} doesn't export a 'name' field. Skipping...`);
      return;
    }

    try {
      agent.addProcess(
        actions.name,
        actions,
        storeHttpClient,
        fossilizerHttpClients,
        {
  plugins: processPlugins
        }
);
    } catch (err) {
  console.error(`Could not load process: ${actions.name}`);
}
  });
});

// Creates an HTTP server for the agent with CORS enabled.
const agentHttpServer = Agent.httpServer(agent, { cors: {} });

// Create the Express server.
const app = express();

app.disable('x-powered-by');

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Create server by binding app and websocket connection
const server = Agent.websocketServer(app, storeHttpClient);

// Start the server.
server.listen(3000, () => {
  console.log(`Listening on : ${agentUrl}`);
});
