const express = require('express');
const app = express();
const port = 3000;

const LAMP_TIMEOUT = 5000; // milliseconds

let lampStates = {}; // object to store state of each lamp
let lampTimeouts = {}; // object to store timeouts for each lamp

app.get('/lamps', (req, res) => {
    res.send(lampStates);
  });

app.get('/lamp/:id', (req, res) => {
  const id = req.params.id;
  const state = lampStates[id];
  if (state !== undefined) {
    res.send({ id: id, state: state });
  } else {
    res.status(404).send({ error: `Lamp ${id} not found` });
  }
});

app.get('/lamp/:id/on', (req, res) => {
  const id = req.params.id;
  lampStates[id] = true;
  clearTimeout(lampTimeouts[id]);
  lampTimeouts[id] = setTimeout(() => {
    lampStates[id] = false;
    console.log(`Lamp ${id} turned off due to inactivity`);
  }, LAMP_TIMEOUT);
  res.send({ id: id, success: true });
});

app.get('/lamp/:id/off', (req, res) => {
  const id = req.params.id;
  lampStates[id] = false;
  clearTimeout(lampTimeouts[id]);
  res.send({ id: id, success: true });
});

app.listen(port, () => {
  console.log(`Lamp server listening at http://localhost:${port}`);
});
