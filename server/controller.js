const nunjucks = require('nunjucks')
const http = require('http')
const static = require('node-static')

var url = require('url');
var util = require('util');
var querystring = require('querystring');
// var cookieParser = require('cookie-parser');
// var http = require('http')
var Cookies = require('cookies')

const model = require('./model')
const query = require('./database-mysql').query

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
    method: 'get',
    controller: 'login_form'
}
urls['/loggout'] = {
    method: 'get',
    controller: 'loggout'
}

urls['/register_form'] = {
    method: 'post',
    controller: 'register_form'
}

urls['/post_article'] = {
    method: 'get',
    controller: 'post_article'
}

urls['/post_article_form'] = {
    method: 'post',
    controller: 'post_article_form'
}

function htmlPage(response, fileName, data){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(nunjucks.render(fileName, data));
    response.end();
}

views['index'] = function(request, response) {
    console.log('index')
    var keys = ['keyboard cat'] 
    var cookies = new Cookies(request, response,{ keys: keys })
    var lastVisit = cookies.get('LastVisit', { signed: true })
    let data
    if (!lastVisit || lastVisit == 'nologining') {
        data = {
            title: "index",
            name: 'Welcome, first time visitor!'
        }
    } else {
        data = {
            title: "index",
            name: cookies.get('LastVisit', { signed: true })
        }
    }
    
    // let data = {
    //     title: "index",
    //     name: cookies.get('LastVisit', { signed: true })
    // }
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
views['login_form'] = async function(request, response) {

    console.log('login_form')
    let data = {
        title: "login_form",
        message: "login page"
    }
    var body = "";
    request.on('data', function (chunk) {
        body += chunk;
    });
    request.on('end', async function () {
        // 解析参数
        body = querystring.parse(body);
        // await query(
        //     `DROP TABLE user`
        // )
        await query(
            `
            CREATE TABLE IF NOT EXISTS user(
                id      INT     NOT NULL    AUTO_INCREMENT,
                name    TEXT    NOT NULL,
                password      INT     NOT NULL, 
                PRIMARY KEY (id)
            )
            `
        )
        let res
        var keys = ['keyboard cat'] 
        var cookies = new Cookies(request, response,{ keys: keys })
        try { // statements to try
            res = await query(
                "SELECT * FROM user WHERE name = " + String(body.username) 
            )
        }
        catch (e) {
            response.writeHead(301, { "Location": "http://"+String(host)+":"+String(port)+"/register" });
            response.end();
        }

        cookies.set('LastVisit', String(body.username), { signed: true })
        response.writeHead(301, { "Location": "http://"+String(host)+":"+String(port)+"/" });
        response.end();
    });
}
views['register'] = function(request, response) {

    console.log('register')
    let data = {
        title: "register",
        message: "register page"
    }

    htmlPage(response, "register.html", data)
}
views['register_form'] = async function(request, response) {

    console.log('register_form')
    let data = {
        title: "register_form",
        message: "register page"
    }
    var body = "";
    request.on('data', function (chunk) {
        body += chunk;
    });
    request.on('end', async function () {
        // 解析参数
        body = querystring.parse(body);
        // await query(
        //     `DROP TABLE user`
        // )
        await query(
            `
            CREATE TABLE IF NOT EXISTS user(
                id      INT     NOT NULL    AUTO_INCREMENT,
                name    TEXT    NOT NULL,
                password      INT     NOT NULL, 
                PRIMARY KEY (id)
            )
            `
        )
        let res
        try { // statements to try
            res = await query(
                "SELECT * FROM user WHERE name = " + String(body.username) 
            )
        }
        catch (e) {
            await query(
                `INSERT INTO user ( name,password ) VALUE ( `+'"'+ String(body.username)+'"'+`,`+String(body.password)+ `)`
            )
        }
        console.log("yaaaaaa = "+String(res))


        res = await query(
            `SELECT * FROM user`
        )
        console.log(res)


        var keys = ['keyboard cat'] 
 
        var cookies = new Cookies(request, response,{ keys: keys })
         
        // Get a cookie
        // var lastVisit = cookies.get('LastVisit', { signed: true })
                
        // Set the cookie to a value
        cookies.set('LastVisit', String(body.username), { signed: true })
        // if (!lastVisit) {
        //     response.setHeader('Content-Type', 'text/plain')
        //     response.end('Welcome, first time visitor!')
        // } else {
        //     response.setHeader('Content-Type', 'text/plain')
        //     response.end('Welcome back! Nothing much changed since your last visit at ' + String(body.username) + '.')
        // }
        response.writeHead(301, { "Location": "http://"+String(host)+":"+String(port)+"/" });
        response.end();
    });
}

views['loggout'] = function(request, response) {
    console.log('loggout')
    var keys = ['keyboard cat'] 
    var cookies = new Cookies(request, response,{ keys: keys })
    cookies.set('LastVisit', 'nologining', { signed: true })
    response.writeHead(301, { "Location": "http://"+String(host)+":"+String(port)+"/" });
    response.end();
}

views['post_article'] = function (request, response) {

    console.log('post_article')
    let data = {
        title: "post article",
        message: "post article page"
    }

    htmlPage(response, "post_article.html", data)
}

views['post_article_form'] = async function (request, response) {
    console.log('post_article')
    var body = "";
    request.on('data', function (chunk) {
        body += chunk;
    });
    request.on('end', async function () {
        body = querystring.parse(body);
        await query(
            `
            CREATE TABLE IF NOT EXISTS post(
                name    TEXT      NOT NULL,
                time    TIMESTAMP NOT NULL,
                content TEXT      NOT NULL,
            )
            `
        )
        await query(
            `INSERT INTO post (name, time, content) VALUE ( ` + String(body.name) + `,` + body.time + ',' + String(body.content) + `)`
        )
        response.writeHead(301, { "Location": "http://" + String(host) + ":" + String(port) + "/" });
        response.end();
    });
}

staticServer = new static.Server('./');

function requestHandler(request, response){

    if(request.url.includes("static")){
        staticServer.serve(request, response);
    }
    else{
        let url = urls[request.url];
        
        if(url == undefined){
            console.log(request.url)
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
