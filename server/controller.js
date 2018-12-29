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

urls['/register'] = {
    method: 'get',
    controller: 'register'
}

urls['/coin'] = {
    method: 'get',
    controller: 'coin'
}

urls['/test'] = {
    method: 'get',
    controller: 'test'
}

function htmlPage(response, fileName, data) {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(nunjucks.render(fileName, data));
    response.end();
}


views['test'] = function (request, response) {
    console.log('test')

    let data = {
        title: "test"
    }

    htmlPage(response, "test.njk", data)
}

views['index'] = function (request, response) {
    console.log('index')

    let timestamp = new Date();
    let time = (timestamp.getMonth()+1) + '/' + (timestamp.getDate()) + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes()

    let data = {
        articles: [
            { title: "foo1", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo2", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo3", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo4", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo5", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo6", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo7", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo8", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo9", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo10", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
            { title: "foo11", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " },
        ]
    }

    htmlPage(response, "index.njk", data)
}

views['login'] = function (request, response) {
    console.log('login')

    let data = {
        title: "login",
        message: "login page"
    }

    htmlPage(response, "login.njk", data)
}

views['register'] = function (request, response) {
    console.log('register')
    htmlPage(response, "register.njk")
}

views['coin'] = function (request, response) {
    console.log('coin')

    htmlPage(response, "coin.njk")
}


staticServer = new static.Server('./');

function requestHandler(request, response) {
    try {
        if (request.url.includes("static")) {
            staticServer.serve(request, response);
        }
        else {
            let url = urls[request.url]; // ffff.com/fuck

            if (url == undefined) {
                console.error("invalid request")
            }
            else {
                let controller = url.controller
                if (typeof (controller) == "string") {
                    return views[url.controller](request, response)
                }
                else if (typeof (controller == "function")) {
                    return controller(request, response)
                }

            }
        }
    }
    catch(e){
        console.error(e);
    }
    
}

http.createServer(requestHandler).listen(port, host);
console.log("Server has started.");
