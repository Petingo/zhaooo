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

function htmlPage(response, fileName, data){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(nunjucks.render(fileName, data));
    response.end();
}

views['index'] = function(request, response) {
    console.log('index')

    let data = {
        title: "index",
        name: model.getName()
    }

    htmlPage(response, "index.html", data)
}

views['login'] = function(request, response) {
    console.log('login')

    let data = {
        title: "login",
        message: "login page"
    }

    htmlPage(response, "login.html", data)
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
            let controller = url.controller
            if(typeof(controller) == "string"){
                return views[url.controller](request, response)
            }
            else if(typeof(controller == "function")){
                return controller(request, response)
            }
            
        }
    }
    
}

http.createServer(requestHandler).listen(port, host);
console.log("Server has started.");
