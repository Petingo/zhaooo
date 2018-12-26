const nunjucks = require('nunjucks')
const http = require('http')
const static = require('node-static')

const model = require('./model')


const host = "127.0.0.1"
const port = 8000

const urls = {}
const views = {}

const templateDir = "templates"
nunjucks.configure(templateDir, { autoescape: true });

urls['/'] = {
    method: 'get',
    controller: 'index'
}

urls['/login'] = {
    method: 'get',
    controller: 'login'
}

views['index'] = function(request, response) {
    console.log('index')
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}

views['login'] = function(request, response) {
    console.log('login')
    response.writeHead(200, {"Content-Type": "text/html"});

    let data = {
        title: "login",
        name: model.getName()
    }
    
    response.write(nunjucks.render("index.html", data));
    response.end();
}

staticServer = new static.Server('./');
function requestHandler(request, response){

    if(request.url.includes("static")){
        staticServer.serve(request, response);
    }
    else{
        let url = urls[request.url];
        
        if(url == undefined){
            console.error("invalid request")
        }
        else{
            let controller = views[url.controller]
            return controller(request, response)
        }
    }
    
}

http.createServer(requestHandler).listen(port, host);
console.log("Server has started.");
