const sql = require("mssql")

const config = {
    user: 'Petingo_SQLLogin_1',
    password: 'tcfven3b5p',
    server: 'zhaooo-database.mssql.somee.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'zhaooo-database',
}

async function test() {
    try {
        // connect
        let pool = await sql.connect(config)
        console.log('connect succeed')

        // create table
        let create = await pool.request().query(
            `
            IF OBJECT_ID(N'zzz', N'U') IS NULL
            CREATE TABLE zzz (
                ID          INT         NOT NULL    IDENTITY(1, 1)  PRIMARY KEY,
                COUNT       INT         ,
                NAME        CHAR(99)
            )
            `
        )
        console.log('created succeed')
        
        // insert
        await pool.request().query(
            `
            INSERT INTO zzz (COUNT, NAME) VALUES (55555, 'MEOW')
            INSERT INTO zzz (COUNT, NAME) VALUES (333, 'GG')
            `
        )
        console.log('insert succeed')

        // update
        // https://www.1keydata.com/tw/sql/sqlupdate.html
        await pool.request().query(
            `
            UPDATE zzz
            SET NAME = 'dicker'
            WHERE COUNT = 333
            `
        )
        console.log('update succeed')

        // select
        let result = await pool.request().query(
            `
            SELECT * FROM zzz;
            `
        )
        console.log(result)

        // // drop
        // await pool.request().query(
        //     `
        //     DROP TABLE zzz;
        //     `
        // )
        
        // result = await pool.request().query(
        //     `
        //     SELECT * FROM zzz;
        //     `
        // )

    } catch (err) {
        console.log(err)
    }
}
