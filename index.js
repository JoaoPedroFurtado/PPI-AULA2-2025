import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 3000;
const logado = false;
const app = express();
var listaProdutos = [];

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "M1nhaSenh4",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: false
    } 
}));

app.use(cookieParser());

app.get("/",  verificarAutenticacao, (req, res) => {
   const ultimoLogin = req.cookies.ultimoLogin;
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
            .navbar {
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
        </style>
    </head>
    <body>

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="/">Menu do Sistema</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="cadastrosDropdown" role="button" data-bs-toggle="dropdown">
                                Cadastros
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastroProduto">Produtos</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="/logout">Sair</a>
                        </li>
                    </ul>
                    <span class="navbar-text">${ultimoLogin?"Ultimo acesso:" + ultimoLogin: ""}
                </div>
            </div>
        </nav>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `);
});



app.get("/cadastroProduto", verificarAutenticacao, (req, res) => {
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
                            <a class="btn btn-primary" type="button" href="/">Voltar</a>
                        </div>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
            </html>
        `);
        res.end();
});

app.post("/cadastroProduto", verificarAutenticacao, (requisicao, resposta) => {
    const nomeProduto = requisicao.body.nomeProduto;
    const categoria = requisicao.body.categoria;
    const preco = requisicao.body.preco;
    const quantidade = requisicao.body.quantidade;
    const codigo = requisicao.body.codigo;

    if(nomeProduto && categoria && preco && quantidade && codigo){
        listaProdutos.push({
            nomeProduto,
            categoria,
            preco,
            quantidade,
            codigo,
        });
        resposta.redirect("/listaProdutos");
    }else{
     let conteudo = `
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
                        <div class="col-md-6">`
                        if(!nomeProduto){
                            conteudo += `
                            <label for="nomeProduto" class="form-label">Nome do Produto</label>
                            <input type="text" class="form-control" id="nomeProduto" name="nomeProduto" required>
                            <span class="text-danger">Por favor informe o Nome do produto</span>
                            `
                        }else{
                            conteudo += `
                            <label for="nomeProduto" class="form-label">Nome do Produto</label>
                            <input type="text" class="form-control" id="nomeProduto" name="nomeProduto" value="${nomeProduto}" required>
                            `
                        }
                        
                        conteudo += `</div>
                        <div class="col-md-6">`
                        if(!categoria){
                            conteudo += `
                            <label for="categoria" class="form-label">Categoria</label>
                            <input type="text" class="form-control" id="categoria" name="categoria" required>
                            <span class="text-danger">Por favor informe a categoria</span>
                            `
                        }else{
                           conteudo += `
                            <label for="categoria" class="form-label">Categoria</label>
                            <input type="text" class="form-control" id="categoria" name="categoria" value="${categoria}" required>
                            `
                        }

                       conteudo +=` </div>

                        <div class="col-md-4">`
                        if(!preco){
                           conteudo += `
                            <label for="preco" class="form-label">Preço (R$)</label>
                            <input type="number" class="form-control" id="preco" name="preco" step="0.01" required>
                            <span class="text-danger">Por favor informe o preco</span>
                            `
                        }else{
                            conteudo += `
                            <label for="preco" class="form-label">Preço (R$)</label>
                            <input type="number" class="form-control" id="preco" name="preco" step="0.01" value="${preco}" required>
                            `
                        }
                        
                        conteudo+=`</div>

                        <div class="col-md-4">`
                        if(!quantidade){
                            conteudo+= `
                            <label for="quantidade" class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" id="quantidade" name="quantidade"  required>
                            <span class="text-danger">Por favor informe a quantidade</span>
                            `
                        }else{
                            conteudo+=`
                            <label for="quantidade" class="form-label">Quantidade em Estoque</label>
                            <input type="number" class="form-control" id="quantidade" name="quantidade" value="${quantidade}" required>
                            `
                        }
                       conteudo+= ` </div>

                        <div class="col-md-4">`
                        if(!codigo){
                            conteudo+= `  
                            <label for="codigo" class="form-label">Código do Produto</label>
                            <input type="text" class="form-control" id="codigo" name="codigo"required>
                            <span class="text-danger">Por favor informe o codigo</span>
                            `
                        }else{
                            conteudo+= `
                            <label for="codigo" class="form-label">Código do Produto</label>
                            <input type="text" class="form-control" id="codigo" name="codigo" value="${codigo}" required>
                            `
                        }
                       conteudo+= `</div>
                <div class="col-12">
                    <button class="btn btn-success" type="submit">Cadastrar Produto</button>
                    <button class="btn btn-primary" type="button" href="/">Voltar</button>
                </div>
                    </form>
                </div>
            </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </html>`
    resposta.send(conteudo);
    };
});

app.get("/listaProdutos", verificarAutenticacao, (requisicao, resposta) => {
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


app.get("/login", (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color:rgb(128, 128, 128);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .login-container {
                    background-color: #f1f1f1;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    width: 300px;
                    text-align: center;
                }
                h1 {
                    color: white;
                    position: absolute;
                    top: 20px;
                }
                h2 {
                    margin-bottom: 20px;
                    color: #0086A8;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    background-color: #0086A8;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #006b86;
                }
            </style>
        </head>
        <body>
            <h1>Acessar o Sistema</h1>
            <div class="login-container">
                <h2>Login</h2>
                <form action="/login" method="post">
                    <label for="usuario">Usuário:</label><br>
                    <input type="text" id="usuario" name="usuario" required><br>
                    <label for="senha">Senha:</label><br>
                    <input type="password" id="senha" name="senha" required><br>
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post("/login", (requisicao, resposta)=> {
    const nameuser = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(nameuser == "admin" && senha == "123"){
        requisicao.session.logado = true;
        const dataHorasAtuais = new Date();
        resposta.cookie('ultimoLogin', dataHorasAtuais.toLocaleDateString(), {maxAge: 1000 * 60 * 60 * 24 *30});
        resposta.redirect("/");
    }else{
        resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Login</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background-color:rgb(128, 128, 128);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .login-container {
                    background-color: #f1f1f1;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    width: 300px;
                    text-align: center;
                }
                h1 {
                    color: white;
                    position: absolute;
                    top: 20px;
                }
                h2 {
                    margin-bottom: 20px;
                    color: #0086A8;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    background-color: #0086A8;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #006b86;
                }
            </style>
        </head>
        <body>
            <h1>Acessar o Sistema</h1>
            <div class="login-container">
                <h2>Login</h2>
                <form action="" method="post">
                <div>
                    <label for="usuario">Usuário:</label><br>
                    <input type="text" id="usuario" name="usuario" required>
                </div>
                <div>
                    <label for="senha">Senha:</label><br>
                    <input type="password" id="senha" name="senha" required>
                 </div>
                 <span style="color: red;"> Usuário ou senha inválidos!<span>
                 <div class="mt-2">
                    <button type="submit">Entrar</button>
                 </div>
                </form>
            </div>
        </body>
     </html>
    `);
}
});

function verificarAutenticacao(requisicao, resposta, next){
    if(requisicao.session.logado){
        next();
    }else{
        resposta.redirect("/login");
    }
}

app.get("/logout", (requisicao, resposta)=> {
    requisicao.session.destroy();
    resposta.redirect("/login")
});

app.listen(port, host, () => {
    console.log(`Servidor em execução em http://${host}:${port}/`);
});
