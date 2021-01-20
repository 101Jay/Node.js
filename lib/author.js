var connection = require('./db.js');
var template = require('./template.js');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.index = function(request,response,queryData_id){
	connection.query(`SELECT * FROM topic`, function(error, topics){
		if(error){
			throw error;
		}
		connection.query(`SELECT * FROM author`,function(error2,authors){
			if(error2){
				throw error2;
			}
			connection.query(`SELECT * FROM author WHERE id=?`,[queryData_id],function(error3,author){
				if(error3){
					throw error3;
				}
				var title = 'WEB1-author';
				var table = template.authorTable(authors);
				if(queryData_id === undefined){
					var namevalue = "";
					var profile = "";
					var submit = 'create';
					var process = '/author/create_process';
				}else{
					var namevalue = sanitizeHtml(author[0].name);
					var profile = sanitizeHtml(author[0].profile);
					var submit = 'update';
					var process = '/author/update_process';
				} 
				var list = template.list(topics);
				var html = template.HTML(title, list,
				`
				<form action="${process}" method="post">
				<p><input type ="hidden" name ="id" value=${queryData_id}></p>
				<p><input type="text" name="title" placeholder="name" value=${namevalue}></p>
				<p><textarea name="description" placeholder="profile">${profile}</textarea></p>
				<p><input type="submit" value =${submit}></p>
				</form>	
				`,
				`<h2>Author List</h2>
				${table}
				`);
				response.writeHead(200);
				response.end(html);
			})
		})
	})
}

exports.create_process = function(request,response){
	var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
		  connection.query(`INSERT INTO author (name,profile) VALUES(?,?)`,[post.title,post.description], function(error,result){
			  if(error){
				  throw error;
			  }
			  response.writeHead(302, {Location: `/author`});
              response.end();
		  })
	  })
}

exports.update_process = function(request,response){
	var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
		  connection.query(`UPDATE author SET name=?, profile=? WHERE id =?`,[post.title,post.description,post.id],function(error,result){
			  if(error){
				  throw error;
			  }
			  response.writeHead(302, {Location: `/author`});
              response.end();
		  })
	  })
}

exports.delete_process = function(request,response){
	var body = '';
    request.on('data', function(data){
          body = body + data;
      });
    request.on('end', function(){
			  var post = qs.parse(body);
			  connection.query(`DELETE FROM topic WHERE author_id =?`,[post.id],function(error1,result1){
				  if(error1){
					  throw error1;
				  }
				  connection.query(`DELETE FROM author WHERE id=?`,[post.id],function(error,result){
				  if(error){
					  throw error;
				  }
				  response.writeHead(302, {Location: `/author`});
				  response.end();
			  	  })
			  })
      });
}
			