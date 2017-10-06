// This file creates an Express server and mounts the agent on it.

var crypto = require('crypto');
var express = require('express');
var Agent = require('stratumn-agent');
var plugins = Agent.plugins;

// Load actions.
var actions_goods = require('./lib/actions-goods');
var actions_employees = require('./lib/actions-employees');

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
var storeHttpClient = Agent.storeHttpClient(process.env.STRATUMN_STORE_URL || 'http://store:5000');
// Do not use a fossilizer.
var fossilizerHttpClient = null;

// Creates an agent
var agentUrl = process.env.STRATUMN_AGENT_URL || 'http://localhost:3000';
var agent = Agent.create({
  agentUrl: agentUrl,
});

// Adds a process from a name, its actions, the store client, and the fossilizer client.
// As many processes as one needs can be added. A different storeHttpClient and fossilizerHttpClient may be used.
agent.addProcess('goods', actions_goods, storeHttpClient, fossilizerHttpClient, {
  // plugins you want to use
  plugins: [plugins.agentUrl(agentUrl), plugins.actionArgs, plugins.stateHash]
});
agent.addProcess('employees', actions_employees, storeHttpClient, fossilizerHttpClient, {
  // plugins you want to use
  plugins: [plugins.agentUrl(agentUrl), plugins.actionArgs, plugins.stateHash]
});

// Creates an HTTP server for the agent with CORS enabled.
var agentHttpServer = Agent.httpServer(agent, { cors: {} });

// Create the Express server.
var app = express();
app.disable('x-powered-by');

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Create server by binding app and websocket connection
const server = Agent.websocketServer(app, storeHttpClient);

// Start the server.
server.listen(3000, function() {
  console.log('Listening on :' + this.address().port);
});
