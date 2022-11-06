const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });


    connection.connect(function(err) {
      if (err) throw err;

      var sql = "SELECT * FROM extensions_tags WHERE extension_id = " + event.extension_id + " and tag_id = " + event.tag_id + " LIMIT 1";
      connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        if(result && result.length > 0){
          callback( null, result[0] ); 
          connection.end();
        }
        else{

          var sql = "INSERT INTO extensions_tags(extension_id,tag_id) VALUES(" + event.extension_id + ", " + event.tag_id + ")";
        
          connection.query(sql, function (error, results, fields) {

            var inserted = {};
            inserted.id = results.insertId;
            inserted.extension_id = event.extension_id;
            inserted.tag_id = event.tag_id;
        
            callback( null, inserted );
            connection.end();
      
          });          

        }
      });
    });
});