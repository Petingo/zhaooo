const nunjucks = require('nunjucks')
const http = require('http')
const static = require('node-static')
const Cookies = require('cookies')
// const model = require('./model')
const querystring = require('querystring')
const query = require('./database-mysql').query
const model = require('./database-mysql')

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

urls['/register'] = {
    method: 'get',
    controller: 'register'
}
urls['/login'] = {
    method: 'get',
    controller: 'login'
}
urls['/login_form'] = {
    method: 'post',
    controller: 'login_form'
}
urls['/logout'] = {
    method: 'post',
    controller: 'logout'
}

urls['/register_form'] = {
    method: 'post',
    controller: 'register_form'
}

urls['/post_article'] = {
    method: 'post',
    controller: 'post_article'
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

views['index'] = async function (request, response) {
    console.log('index')

    let keys = ['keyboard cat'] 
    let cookies = new Cookies(request, response,{ keys: keys })
    let lastVisit = cookies.get('LastVisit', { signed: true })

    let result = await query(
        "SELECT * FROM post"
    )

    /*
    let timestamp = new Date();
    let time = (timestamp.getMonth()+1) + '/' + (timestamp.getDate()) + ' ' + timestamp.getHours() + ':' + timestamp.getMinutes()
    */
    let data = {
        user_name: lastVisit,
        articles: [
            /*
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
            { title: "foo11", time: time, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi " }
            */
        ]
    }
    result.sort(function (a, b) {
        if (a.time > b.time) { return -1 }
        if (a.time < b.time) { return 1 }
    })
    for (i = 0; i < 10; i++) {
        data.articles.push({"id":result[i].name, "time":result[i].time, "content":result[i].content})
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
views['login_form'] = async function (request, response) {

    console.log('login_form')
    let data = {
        title: "login_form",
        message: "login page"
    }
    let body = "";
    request.on('data', function (chunk) {
        body += chunk;
    });
    request.on('end', async function () {
        // 解析参数
        body = querystring.parse(body);
        let res
        res = await model.createUser()
        
        var keys = ['keyboard cat']
        var cookies = new Cookies(request, response, { keys: keys })
        valid = model.validateUser(body.username, body.password)
        if (valid) {
            cookies.set('LastVisit', String(body.username), { signed: true })
            response.writeHead(301, { "Location": "http://" + String(host) + ":" + String(port) + "/" });
            response.end();
        }
        else{
            console.log(valid)
            response.writeHead(301, { "Location": "http://" + String(host) + ":" + String(port) + "/register" });
            response.end();
        }

    });
}
views['register'] = function(request, response) {

    console.log('register')
    let data = {
        title: "register",
        message: "register page"
    }

    htmlPage(response, "register.njk", data)
}
views['register_form'] = async function(request, response) {

    console.log('register_form')
    let data = {
        title: "register_form",
        message: "register page"
    }
    let body = "";
    request.on('data', function (chunk) {
        body += chunk;
    });
    request.on('end', async function () {
        // 解析参数
        body = querystring.parse(body);

        await model.createUser()
        let res
        let success = model.addUser(body.username,body.password)

        res = await query(
            `SELECT * FROM user`
        )
        console.log(res)


        var keys = ['keyboard cat'] 
        var cookies = new Cookies(request, response,{ keys: keys })
        cookies.set('LastVisit', String(body.username), { signed: true })
        response.writeHead(301, { "Location": "http://"+String(host)+":"+String(port)+"/" });
        response.end();
    });
}

views['logout'] = function (request, response) {
    console.log('logout')
    let keys = ['keyboard cat'] 
    let cookies = new Cookies(request, response,{ keys: keys })
    cookies.set('LastVisit', 'nologining', { signed: true })
    response.writeHead(301, { "Location": "http://"+String(host)+":"+String(port)+"/login" });
    response.end();
}

/*
views['post_article'] = function (request, response) {

    console.log('post_article')
    let data = {
        title: "post article",
        message: "post article page"
    }

    htmlPage(response, "post_article.html", data)
}
*/

views['post_article'] = async function (request, response) {
    console.log('post_article')
    let body = "";
    request.on('data', function (chunk) {
        body += chunk;
    });
    request.on('end', async function () {
        body = querystring.parse(body);
        await model.createPost()
        // await query(
        //     `
        //     CREATE TABLE IF NOT EXISTS post(
        //         name    TEXT      NOT NULL,
        //         time    TIMESTAMP NOT NULL,
        //         content TEXT      NOT NULL
        //     )
        //     `
        // )
        var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        console.log(datetime)
        var keys = ['keyboard cat']
        var cookies = new Cookies(request, response, { keys: keys })
        var username = cookies.get("LastVisit")
        var block = [String(username), datetime, String(body.content)]

        await model.addPost()
        // await query(
        //     "INSERT INTO post (name, time, content) VALUE (?, ?, ?)", block
        // )
        response.writeHead(301, { "Location": "http://" + String(host) + ":" + String(port) + "/" });
        response.end();
    });
}

views['register'] = function (request, response) {
    console.log('register')
    htmlPage(response, "register.njk")
}

views['coin'] = function (request, response) {
    console.log('coin')
    let data = {
        coin_amoount: 66666
    }
    htmlPage(response, "coin.njk", data)
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
