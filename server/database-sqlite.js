const sqlite = require('sqlite')
const query = function(sql){
    return new Promise(async (resolve, reject) => {
        sqlite.open('./database/db.sqlite')
        .then((db) => {
            resolve(db.all(sql))
        })
    })
    // catch error ㄉ版本:
    // return new Promise(async (resolve, reject) => {
    //     sqlite.open('./database/db.sqlite')
    //     .then((db) => {
    //         resolve(db.all(sql).catch(e => reject(e)))
    //     })
    //     .catch(e => reject(e))
    // })
}

let createUser = async function(){
    // query(
    //     `DROP TABLE user`
    // )
    try{
        await query(
            `
            CREATE TABLE IF NOT EXISTS user(
                id      INTEGER PRIMARY KEY   AUTOINCREMENT,
                name    TEXT    NOT NULL,
                password INT NOT NULL
            )
            `
        )
    }
    catch(e){
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

let addUser = async function(name, password){
    try { // statements to try
        await query(
            `INSERT INTO user ( name,password ) VALUES ( `+'"'+ String(name)+'"'+`,`+String(password)+ `)`
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true

}
let listPost = async function(lastVisit){
    return result =  await query(
        "SELECT * FROM post"
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
        let haha =             "INSERT INTO post (name, time, content) VALUES ("+ String(block[0]) + ", "+ String(block[1]) + ", "+ String(block[2]) + ")"

        console.log(haha)
        await query(
            "INSERT INTO post (name, time, content) VALUES ('"+ String(block[0]) + "', '"+ String(block[1]) + "', '"+ String(block[2]) + "')"
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true

}
let listUser = async function(){
    return await query(
        "SELECT * FROM user"
    )
}
async function test() {
    let s = await query(`SELECT * FROM user`)
    console.log(s);
    // AUTO_INCREMENT 沒有底線
    // Primary key 的設定方式不一樣
    // await db.all(`
    //     CREATE TABLE IF NOT EXISTS user(
    //         id      INTEGER PRIMARY KEY   AUTOINCREMENT,
    //         name    TEXT    NOT NULL
    //     )
    // `)

    // // insert
    // // value 差一個 s
    // await db.all(
    //     `
    //     INSERT INTO user ( name ) VALUES ( "zhao" )
    //     `
    // )

    // // select 可以直接用
    // let res = await db.all(
    //     `
    //     SELECT * FROM user
    //     `
    // )
    // console.log(res)
}

test()

module.exports = { query, createUser, addUser, validateUser, createPost, addPost, listUser, listPost}