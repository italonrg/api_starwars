const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Importe o body-parser

require('dotenv').config();
const app = express();
const port = 3000;

// Middleware para analisar o corpo da solicitação JSON
app.use(bodyParser.json());
app.use(express.json());


//colocar a senha gerada no mongodb no lugar do password;

// Definindo o modelo Filme
const Filme = mongoose.model('filme', {
    nome: String,
    ano: String,
    image_url: String,
    trailer_url: String
});

// Rota para obter todos os filmes
app.get('/Allfilmes', async (req, res) => {
    const filmes = await Filme.find();
    res.send(filmes);
});

// Rota para adicionar um novo filme
app.post('/filmes', async (req, res) => {
    const novoFilme = new Filme({
        nome: req.body.nome,
        ano: req.body.ano,
        image_url: req.body.image_url,
        trailer_url: req.body.trailer_url
    });

    await novoFilme.save();
    res.send(novoFilme);
});

app.delete('/:id', async (req, res) => {
    try {
      const filme = await Filme.findByIdAndDelete(req.params.id);
      if (!filme) {
        return res.status(404).send({ error: "Movie not found" });
      }
      return res.send(filme);
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  });

  // rota para o update

  app.put('/:id' , async (req , res) =>{
    const filme = Filme.findByIdAndUpdate(req.params.id,{
      nome: req.body.nome,
      ano: req.body.ano,
      image_url: req.body.image_url,
      trailer_url: req.body.trailer_url
    },{
      new:true 
    })
    return res.send(filme);
  })

// Rota principal
app.get('/', (req, res) => {
    res.send('Olá mundo');
});

// Iniciar o servidor
app.listen(port, () => {

    // Conexão com o MongoDB// O mongoose indica colocar a conexão dentro do app.listen;Nota: essa conexão vai ser feita usando o dotenv para seu upada no git.
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log(`Servidor rodando na porta ${port}`);
});
