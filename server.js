const http = require('http'); // Criar um objeto http.
const url = require('url'); // permite resolver e fazer o parser de uma url.
const fs = require('fs'); // interação com sistemas de arquivos
const path = require('path');// lidar com caminho de arquivos, extensões. 

// poderia ter colocado qualquer nome, media type, é um padrão que 
// indica a natureza e o formato de um arquivo.
const mimeTypes = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "text/png",
    jpeg: "text/jpeg",
    jpg: "text/jpg",
    woff: "font/woof"
}

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((req, res) => {
    // req =  requisição
    // res = resposta.
    // cabeçalho
    let acesso_uri = url.parse(req.url).pathname;

    let caminho_completo_recurso =  path.join(process.cwd(), decodeURI(acesso_uri));

    console.log(caminho_completo_recurso);

    let recurso_carregado;

    try {
        recurso_carregado = fs.lstatSync(caminho_completo_recurso);
    } catch (error) {
        res.writeHead(404, {'Content-Type': 'Text/plain'});
        res.write("404: Arquivo não encotrado.");
        res.end();   
    }

    if (recurso_carregado.isFile()) {
        let mimeType = mimeTypes[path.extname(caminho_completo_recurso).substring(1)];

        res.writeHead(200, {'content-Type': mimeType});
        let fluxo_arquivo = fs.createReadStream(caminho_completo_recurso);
        fluxo_arquivo.pipe(res);
    }else if (recurso_carregado.isDirectory()) {
        res.writeHead(302, {'Location': 'index.html'});
        res.end();
    } else {
        res.writeHead(500, {'Location': 'index.html'});
        res.write("500: Erro interno do servidor.");
        res.end();  
    }
}).listen(port, hostname, () => {
    // lista informação atraves do listen.
    console.log(`O servidor está sendo executado em http://${hostname}:${port}/`);
});