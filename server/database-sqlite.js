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