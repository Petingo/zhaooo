const sqlite = require('sqlite')
const query = function (sql) {
    return new Promise(async (resolve, reject) => {
        sqlite.open('./database/db.sqlite')
            .then((db) => {
                resolve(db.all(sql))
            })
    })
}

let createUser = async function () {
    try {
        await query(
            `
            CREATE TABLE IF NOT EXISTS user(
                id       INTEGER  PRIMARY KEY   AUTOINCREMENT,
                name     TEXT     NOT NULL,
                password TEXT     NOT NULL,
                coin     INT      DEFAULT 0,
                friend   TEXT
            )
            `
        )
    } catch (e) {
        return console.error(e)
    }
    return true
}

let addUser = async function (name, password) {
    try { // statements to try
        await query(
            `INSERT INTO user (name, password) VALUES ("${name}", "${password}")`
        )
    } catch (e) {
        return console.error(e)
    }
    return true

}

let validateUser = async function (name, password) {
    let result = await query(
        // "SELECT * FROM user WHERE name = '" + String(name) + "' AND password = '" + String(password) + "'"
        `SELECT * FROM user WHERE name = "${name}" AND password = "${password}"`
    )
    if (result.length == 1) {
        return true
    } else {
        return false
    }
}

let clearUser = async function () {
    try {
        await query(
            `DROP TABLE user`
        )
    } catch (e) {
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
                id      INTEGER   NOT NULL  PRIMARY KEY AUTOINCREMENT,
                name    TEXT      NOT NULL,
                time    TIMESTAMP NOT NULL,
                content TEXT      NOT NULL,
                love    INTEGER   DEFAULT 0,
                angry   INTEGER   DEFAULT 0,
                board   TEXT
            )
            `
        )
    } catch (e) {
        return console.error(e)
    }
    return true
}

let addPost = async function (block) {
    try { // statements to try
        let name = String(block[0])
        let time = String(block[1])
        let content = String(block[2])
        let board = String(block[3])
        // console.log(haha)
        await query(
            `INSERT INTO post (name, time, content, board) VALUES ("${name}", "${time}", "${content}", "${board}")`
        )
    } catch (e) {
        return console.error(e)
    }
    return true

}

let listPost = async function (lastVisit) {
    return result = await query(
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
    } catch (e) {
        return console.error(e)
    }
    return true
}

let addCoin = async function (postId) {
    try { // statements to try
        let username = await query(
            `SELECT name FROM post WHERE id = ${postId}`
        )
        username = String(username[0].name)
        console.log(username)
        await query(
            `UPDATE user SET coin = coin + 1 WHERE name = "${username}"`
        )
        console.log("coin + 1")
    } catch (e) {
        return console.error(e)
    }
    return true
}

let angryPost = async function (postId) {
    try { // statements to try
        await query(
            `UPDATE post SET angry = angry + 1 WHERE id = ${postId}`
        )
    } catch (e) {
        return console.error(e)
    }
    return true
}

let deductCoin = async function (postId) {
    try { // statements to try
        let username = await query(
            `SELECT name FROM post WHERE id = ${postId}`
        )
        username = String(username[0].name)
        console.log(username)
        await query(
            `UPDATE user SET coin = coin - 1 WHERE name = "${username}"`
        )
        console.log("coin - 1")
    } catch (e) {
        return console.error(e)
    }
    return true
}

let applyNewBoard = async function (block) {
    try { // statements to try
        await query(
            `
            CREATE TABLE IF NOT EXISTS new_board_application(
                id          INTEGER NOT NULL  PRIMARY KEY  AUTOINCREMENT,
                name        TEXT    NOT NULL,
                reason      TEXT,
                username    TEXT    NOT NULL
            )`
        )
        let name = String(block[0])
        let reason = String(block[1])
        let username = String(block[2])
        await query(
            `INSERT INTO new_board_application (name, reason, username) VALUES ("${name}", "${reason}", "${username}")`
        )
    } catch (e) {
        return console.error(e)
    }
    return true
}

let queryCoin = async function (user) {
    return await query(
        `SELECT coin FROM user WHERE name = "${user}"`
    )
}

const clubThreshold = 87
let getZhaoClubList = async function () {
    return await query(
        `SELECT name FROM user WHERE coin >= ${clubThreshold}`
    )
}

let createReplyTable = async function () {
    return await query(
        `CREATE TABLE IF NOT EXISTS reply(
            id       INTEGER NOT NULL  PRIMARY KEY  AUTOINCREMENT,
            username TEXT    NOT NULL,
            postId   INT     NOT NULL,
            content  TEXT    NOT NULL
        )`
    )
}

let getReply = async function () {
    await createReplyTable()
    return await query(
        `SELECT * FROM reply`
    )
}

let getReplyOf = async function (postId) {
    await createReplyTable()
    return await query(
        `SELECT * FROM reply WHERE postID = ${postId}`
    )
}

let addReply = async function (username, postId, content) {
    try { // statements to try
        await query(
            `INSERT INTO reply (username, postId, content) VALUES ('${username}', ${postId}, '${content}')`
        )
    } catch (e) {
        return console.error(e)
    }
    return true
}

let addFriend = async function (username, newFriendName) {
    try { // statements to try
        query(
            `SELECT friend FROM user WHERE name = '${username}';`
        ).then((friend) => {
            friend = friend[0].friend
            if (friend == null) {
                friend = ''
            }
            query(
                `UPDATE user SET friend = '${friend + ',' + newFriendName}' WHERE name = '${username}';`
            )
        })
        // then( friends => {
        //     console.log(friends)
        //     query(
        //         `UPDATE user SET friend = '${friends + ',' + newFriendName}' WHERE name = '${username}';`
        //     )
        // }) 
    } catch (e) {
        return console.error(e)
    }
    return true
}

let listFriend = async function (username) {
    return await query(
        `SELECT friend FROM user WHERE name = '${username}';`
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

module.exports = {
    query,
    createUser,
    addUser,
    validateUser,
    clearUser,
    createPost,
    addPost,
    listUser,
    listPost,
    listSpecificPost,
    lovePost,
    addCoin,
    angryPost,
    deductCoin,
    applyNewBoard,
    queryCoin,
    getZhaoClubList,
    getReply,
    addReply,
    addFriend,
    listFriend
}