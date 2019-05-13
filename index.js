const express = require("express");

const helmet = require("helmet");

const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.post("/api/zoos", (req, res) => {
  const post = req.body;
  console.log(post);
  if (post.name) {
    db("zoos")
      .insert(post)
      .then(idShow => {
        res.status(201).json(idShow);
      })
      .catch(err => {
        res.status(400).json({ error: "Some useful error message" });
      });
  } else {
    res.status(500).json({ error: "Somethin wrong" });
  }
});

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      console.log(err);
    });
});

server.get("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    db("zoos")
      .where({ id: `${id}` })
      .first()
      .then(id => {
        res.status(202).json(id);
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.status(500).json({ error: "Something is not working." });
  }
});

server.delete("/api/zoos/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    db("zoos")
      .where({ id: `${id}` })
      .del()
      .then(target => {
        res.status(202).json(target);
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.status(500).json({ error: "something is not working." });
  }
});

server.put("/api/zoos/:id", (req, res) => {
  // const { id } = req.params;
  const name = req.body;
  if (name) {
    db("zoos")
      .where({ name: `${name}` })
      .update({ name: `${name}` })
      .then(animal => {
        res.status(202).json(animal);
      })
      .catch(err => {
        res.status(400).json({ error: "It ain't workin." });
      });
  } else {
    res.status(500).json({ error: "something is not working." });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
