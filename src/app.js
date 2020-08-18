const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function repositoryExist(request, response, next ){
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )

  if (repositoryIndex < 0 ) {
    return response.status(400).json({error: 'Repository id does no exist in our data'})
  }

  return next()

}

app.get("/repositories", (request, response) => {
  
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)
  
  return response.status(200).json(repository)
});

app.put("/repositories/:id", repositoryExist,(request, response) => {
  const { id } = request.params
  const {title, url, techs, likes } = request.body
  if (likes) return response.json({likes : 0})
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )
  const newRepository = {id, title, url, techs, likes : repositories[repositoryIndex].likes }

  repositories[repositoryIndex] = newRepository

  return response.json(newRepository)

});

app.delete("/repositories/:id", repositoryExist,(request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )
  repositories.splice(repositoryIndex, 1)
  
  return response.status(204).send()
});

app.post("/repositories/:id/like", repositoryExist,(request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )
  repositories[repositoryIndex].likes =  repositories[repositoryIndex].likes + 1

  response.status(200).json({likes: repositories[repositoryIndex].likes})
});

module.exports = app;
