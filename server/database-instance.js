const query = require('./database-mysql').query
async function test() {
    // create table
    // await query(
    //     `
    //     CREATE TABLE IF NOT EXISTS user(
    //         id      INT     NOT NULL    AUTO_INCREMENT,
    //         name    TEXT    NOT NULL,
    //         PRIMARY KEY (id)
    //     )
    //     `
    // )

    // insert
    // await query(
    //     `
    //     INSERT INTO user ( name ) VALUE ( "zhao" )
    //     `
    // )

    
    let res = await query(
        `SELECT * FROM user`
    )

    console.log(res)
    console.log("Table deleted");
}

test()