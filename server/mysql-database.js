const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'db4free.net',
    user: 'godzhao',
    password: 'theonlygod',
    database: 'zhaooo_data'
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }