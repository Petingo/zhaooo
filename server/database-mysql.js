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

let createUser = async function () {
    try {
        await query(
            `
            CREATE TABLE IF NOT EXISTS user(
                id       INT     NOT NULL    AUTO_INCREMENT,
                name     TEXT    NOT NULL,
                password INT     NOT NULL,
                coin     INT     DEFAULT 0, 
                PRIMARY  KEY (id)
            )
            `
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let addUser = async function (name, password) {
    try { // statements to try
        await query(
            `INSERT INTO user (name, password) VALUE ( ` + '"' + String(name) + '"' + `,` + String(password) + `)`
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true

}

let validateUser = async function (name, password) {

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

let clearUser = async function () {
    try {
        await query(
            `DROP TABLE user`
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let listUser = async function () {
    return await query(
        "SELECT * FROM user"
    )
}

let createPost = async function () {
    try {
        await query(
            `
            CREATE TABLE IF NOT EXISTS post(
                id      INT       NOT NULL    AUTO_INCREMENT,
                name    TEXT      NOT NULL,
                time    TIMESTAMP NOT NULL,
                content TEXT      NOT NULL,
                love    INTEGER   DEFAULT 0,
                angry   INTEGER   DEFAULT 0,
                board   TEXT,
                PRIMARY KEY (id)
            )
            `
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let addPost = async function (block) {
    try { // statements to try
        await query(
            "INSERT INTO post (name, time, content, board) VALUE (?, ?, ?, ?)", block
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let listPost = async function (lastVisit) {
    return await query(
        "SELECT * FROM post"
    )
}

let listSpecificPost = async function (board) {
    return await query(
        `SELECT * FROM post WHERE board = "${board}"`
    )
}

let lovePost = async function (postId) {
    try { // statements to try
        await query(
            `UPDATE post SET love = love + 1 WHERE id = ${postId}`
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let addCoin = async function (postId) {
    try { // statements to try
        await query(
            `UPDATE user SET coin = coin + 1 WHERE name = ${postId}`
        )
        console.log("coin + 1")
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let angryPost = async function (postId) {
    try { // statements to try
        await query(
            `UPDATE post SET angry = angry + 1 WHERE id = ${postId}`
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let deductCoin = async function (postId) {
    try { // statements to try
        await query(
            `UPDATE user SET coin = coin - 1 WHERE name = ${postId}`
        )
        console.log("coin - 1")
    }
    catch (e) {
        return console.error(e)
    }
    return true
}


let applyNewBoard = async function(block) {
    try { // statements to try
        await query(
            `
            CREATE TABLE IF NOT EXISTS new_board_application(
                id          INT     NOT NULL    AUTO_INCREMENT,
                name        TEXT    NOT NULL,
                reason      TEXT,
                username    TEXT    NOT NULL,
                PRIMARY KEY (id)
            )`
        )
        await query(
            `INSERT INTO new_board_application (name, reason, username) VALUE (?, ?, ?)`, block
        )
    }
    catch (e) {
        return console.error(e)
    }
    return true
}

let queryCoin = async function (user) {
    return await query(
        `SELECT coin FROM user WHERE name = "${user}"`
    )
}

createPost()
module.exports = { query, createUser, addUser, validateUser, clearUser, createPost, addPost, listUser, listPost, listSpecificPost, lovePost, addCoin, angryPost, deductCoin, applyNewBoard, queryCoin}
