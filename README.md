# Develop Doc
## 一開始
``` bash
git clone https://github.com/Petingo/zhaooo.git
cd server
npm i
```

<a href="https://www.freepik.com/free-photos-vectors/love">Love vector created by Freepik</a>

## mysql database

``` javascript
const query = require('./mysql-database').query
async function test() {
    // create table
    await query(
        `
        CREATE TABLE IF NOT EXISTS user(
            id      INT     NOT NULL    AUTO_INCREMENT,
            name    TEXT    NOT NULL,
            PRIMARY KEY (id)
        )
        `
    )

    // insert
    await query(
        `
        INSERT INTO user ( name ) VALUE ( "zhao" )
        `
    )

    // 
    let res = await query(
        `
        SELECT * FROM user
        `
    )
    console.log(res)
}

test()
```