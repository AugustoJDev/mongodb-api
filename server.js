const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

require("colors");
require("./database/connect");

global.jwt = require('jsonwebtoken');

app.use(express.json());
  
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/templates/index.html"));
});

app.get("/login", async (req, res) => {
  let token = await conn.getToken(req.query.name, req.query.pass);

  if(token == "Invalid User") {
    res.send("The login provided doesn't exist in the database.");
  } else {
    res.send({ token: token });
  };
});

app.get("/getUsers", authMiddleware, async (req, res) => {

  let field = req.query;
  if(!field) field = null;
  
  let getUsers = await conn.getDocuments("users", field);
  
  res.send(getUsers)
});

app.get("/getProducts", authMiddleware, async (req, res) => {

  let field = req.query;
  if(!field) field = null;
  
  let getUsers = await conn.getDocuments("products", field);
  
  res.send(getUsers);
});

app.post("/addUser", authMiddleware, async (req, res) => {

  let data = req.body;
  
  if(!data) {
    res.send("Data was not entered or was sent incorrectly.");
  } else {
    let result = await conn.addValues("users", data);

    res.send(result);
  };
});

app.post("/remUser", authMiddleware, async (req, res) => {

  let data = req.body;
  
  if(!data) {
    res.send("Data was not entered or was sent incorrectly.");
  } else {
    let result = await conn.remValues("users", data);

    res.send(result);
  };
});

app.patch("/editUser", authMiddleware, async (req, res) => {

  let data = req.body;
  let dataToChange = {};

  const filter = JSON.parse(data["query"]);
  
  for(keys in data) {
    if(keys == "query") continue;

    dataToChange[keys] = data[keys];
  }
  const update = { $set: dataToChange };

  let result = await conn.editValues("users", filter, update);
  
  res.send(result);
});

app.listen(port, () => {
  console.log("App Listening on Port: " + port)
});

async function authMiddleware(req, res, next) {

  let ip = req.ip.split(":")[3];
  
  let bl = await conn.getDocuments("blacklist", { ip: ip });

  if(bl.length > 0) return res.send("IP Blocked.");
  
  const token = req.headers.authorization;

  req.query = req.query;

  if (!token) {
    await conn.logs(ip);
    
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtKey);
    next();
  } catch (error) {
    await conn.logs(ip);
    
    return res.status(403).json({ mensagem: 'Token de autenticação inválido.' });
  }
}