const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'db4free.net',
    user: 'godzhao',
    password: 'theonlygod',
    database: 'zhaooo_data'
})

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

let createUser = async function(){
    try{
        await query(
            `
            CREATE TABLE IF NOT EXISTS user(
                id       INT     NOT NULL    AUTO_INCREMENT,
                name     TEXT    NOT NULL,
                password INT     NOT NULL, 
                PRIMARY KEY (id)
            )
            `
        )
    }
    catch(e){
        return console.error(e)
    }
    return true
}

let addUser = async function(name, password){
    try { // statements to try
        await query(
            `INSERT INTO user ( name,password ) VALUE ( `+'"'+ String(name)+'"'+`,`+String(password)+ `)`
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true

}

let validateUser = async function(name, password){

    try { // statements to try
        await query(        
            "SELECT * FROM user WHERE name = '" + String(name) + "' AND password = '" + String(password) + "'"
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
    
}

let clearUser = async function(){
    try{
        await query(
            `DROP TABLE user`
        )
    }
    catch(e){
        return console.error(e)
    }
    return true
}

let listUser = async function(){
    return await query(
        "SELECT * FROM user"
    )
}

let createPost = async function(){
    try{
        await query(
            `
            CREATE TABLE IF NOT EXISTS post(
                name    TEXT      NOT NULL,
                time    TIMESTAMP NOT NULL,
                content TEXT      NOT NULL
            )
            `
        )
    }
    catch(e){
        return console.error(e)
    }
    return true
}

let addPost = async function(block){
    try { // statements to try
        await query(
            "INSERT INTO post (name, time, content) VALUE (?, ?, ?)", block
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true

}

let listPost = async function(lastVisit){
    // let data = {
    //     user_name: lastVisit,
    //     articles: []
    // }
    result =  await query(
        "SELECT * FROM post"
    )
    
    // result = [].slice.call(result).sort(function (a, b) {
    //     if (a.time > b.time) { return -1 }
    //     if (a.time < b.time) { return 1 }
    // })

    // for (i = 0; i < 10; i++) {
    //     data.articles.push({"id":result[i].name, "time":result[i].time, "content":result[i].content})
    // }

    return result
}

module.exports = { query, createUser, addUser, validateUser, clearUser, createPost, addPost, listUser, listPost}