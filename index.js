import express from "express";

const host = "0.0.0.0";
const port = 3000;

const app = express();
var listaProdutos = [];

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Página inicial do aplicativo</title>
        <style>
            body, html {
                height: 100%;
            }
        </style>
    </head>
    <body>
        <div class="container d-flex justify-content-center align-items-center" style="height: 80vh;">
            <div class="card shadow p-4">
                <h1 class="card-title text-center mb-3">Bem-vindo ao Sistema</h1>
                <div class="d-flex justify-content-center">
                    <a class="btn btn-primary" href="/cadastroProduto">Ir para Cadastro de Produtos</a>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `);
});


app.get("/cadastroProduto", (req, res) => {
    res.send(`
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Cadastro de Produtos</title>
    </head>
    <body>
        <div class="container w-75 mt-5">
            <form class="row g-3 border rounded p-4" method="POST" action="/cadastroProduto" novalidate>
                <fieldset>
                    <legend class="text-center">Cadastro de Produto</legend>
                </fieldset>

                <div class="col-md-6">
                    <label for="nomeProduto" class="form-label">Nome do Produto</label>
                    <input type="text" class="form-control" id="nomeProduto" name="nomeProduto" required>
                </div>

                <div class="col-md-6">
                    <label for="categoria" class="form-label">Categoria</label>
                    <input type="text" class="form-control" id="categoria" name="categoria" required>
                </div>

                <div class="col-md-4">
                    <label for="preco" class="form-label">Preço (R$)</label>
                    <input type="number" class="form-control" id="preco" name="preco" step="0.01" required>
                </div>

                <div class="col-md-4">
                    <label for="quantidade" class="form-label">Quantidade em Estoque</label>
                    <input type="number" class="form-control" id="quantidade" name="quantidade" required>
                </div>

                <div class="col-md-4">
                    <label for="codigo" class="form-label">Código do Produto</label>
                    <input type="text" class="form-control" id="codigo" name="codigo" required>
                </div>
                <div class="col-12">
                    <button class="btn btn-success" type="submit">Cadastrar Produto</button>
                </div>
            </form>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>
    `);
});

app.post("/cadastroProduto", (requisicao, resposta) => {
    const nomeProduto = requisicao.body.nomeProduto;
    const categoria = requisicao.body.categoria;
    const preco = requisicao.body.preco;
    const quantidade = requisicao.body.quantidade;
    const codigo = requisicao.body.codigo;

    listaProdutos.push({
        nomeProduto,
        categoria,
        preco,
        quantidade,
        codigo,
    });

    resposta.redirect("/listaProdutos");
    resposta.end();
});

app.get("/listaProdutos", (requisicao, resposta) => {
    let conteudo =`
        <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">
        <title>Cadastro de Produtos</title>
    </head>
        <body>
             <div class="container w-75 mb-5 mt-5">
                <table class="table table-striped table-hover">
                     <thead>
                        <tr>
                            <th scope="col">Nome do produto</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Preço</th>
                            <th scope="col">Quantidade</th>
                            <th scope="col">Código</th>
                    </tr>
                </thead>
                <tbody>`;

                for(let i = 0 ; i < listaProdutos.length; i++){
                    conteudo = conteudo + `
                     <tr>
                        <td>${listaProdutos[i].nomeProduto}</td>
                        <td>${listaProdutos[i].categoria}</td>
                        <td>${listaProdutos[i].preco}</td>
                        <td>${listaProdutos[i].quantidade}</td>
                        <td>${listaProdutos[i].codigo}</td>

                    </tr>
                    `
                }
    conteudo = conteudo +  ` </tbody>
            </table>
        </div>
        <a class="btn btn-secondary" href="/cadastroProduto">Cadastre mais produtos...</a>
        </body>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>`
    resposta.send(conteudo);
    resposta.end()
});

app.listen(port, host, () => {
    console.log(`Servidor em execução em http://${host}:${port}/`);
});
