//var exports = module.exports = {}; for understanding
var qs = require('querystring');
var url = require('url');
var template = require('./template.js');
var connection = require('./db.js');

exports.index = function(request,response){
	connection.query(`SELECT * FROM topic`, function(error, topics){
			var title = 'Welcome';
            var description = 'Hello, Node.js';
			var list = template.list(topics);
			var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
         	 );
			response.writeHead(200);
         	response.end(html);
		    })
}

exports.page = function(request,response){	
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	connection.query(`SELECT * FROM topic`, function(error, topics){
			  if(error){
				  throw error;
			  }
			  connection.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,[queryData.id],function(error2, topic){ 
				  //id=?라고해두고 두번째인자로 아이디 값을 주면 공격으로부터 벗어날 수 있다!
				  if(error2){
					  throw error2;
				  }
					var title = topic[0].title; //해당하는 id의 배열만 가져온 것이기 때문이다!
					var description = topic[0].description;
					var list = template.list(topics);//파일리스트가 필요하기 때문에 처음에 dbquery한 것!
					var html = template.HTML(title, list,
					`<h2>${title}</h2>${description}
					<p>by ${topic[0].name}</p>`,
					` <a href="/create">create</a>
					<a href="/update?id=${queryData.id}">update</a>
					<form action="delete_process" method="post">
					  <input type="hidden" name="id" value="${queryData.id}">
					  <input type="submit" value="delete">
					</form>`
					 );
					response.writeHead(200);
					response.end(html);
			  })
		})
}
exports.create = function(request,response){
	connection.query(`SELECT * FROM topic`, function(error, topic){
		if(error){
			throw error;
		}
		connection.query(`SELECT * FROM author`,function(error2,authors){
			var title = 'WEB - create';
			var list = template.list(topic);
			var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="description" placeholder="description"></textarea></p>
			${template.authorSelect(authors)}
            <p><input type="submit"></p>
          </form>
        `, `<a href="/create">create</a>`);
        	response.writeHead(200);
        	response.end(html);
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
		  connection.query(`INSERT INTO topic (title,description,created,author_id) VALUES(?,?,NOW(),?)`,[post.title,post.description,post.author],function(error2,results){
			  if(error2){
				  throw error2;
			  }
			  response.writeHead(302, {Location: `/?id=${results.insertId}`});
              response.end();
		      })
		  })
}

exports.update = function(request,response){
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	connection.query(`SELECT * FROM topic`, function(error, topics){
		  if(error){
			  throw error;
		  }
		  connection.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function(error2,topic){
			  if(error2){
				  throw error2;
			  }
			  connection.query(`SELECT * FROM author`, function(error2,authors){
				  var title = topic[0].title;
				  var description = topic[0].description;
				  var list = template.list(topics);
				  var html = template.HTML(title, list,
				`
				<form action="/update_process" method="post">
				  <input type="hidden" name="id" value="${topic[0].id}">
				  <p><input type="text" name="title" placeholder="title" value="${title}"></p>
				  <p>
					<textarea name="description" placeholder="description">${description}</textarea>
				  </p>
				  ${template.authorSelect(authors, topic[0].author_id)}
				  <p>
					<input type="submit">
				  </p>
				</form>
				`,
				`<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
				 );
				 response.writeHead(200);
				 response.end(html);  
			  })
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
		  connection.query(`UPDATE topic SET title=?, description=?, author_id=?  WHERE id=?`,[post.title,post.description, post.author, post.id], function(error,results){
			  if(error){
				  throw error;
			  }  
			  response.writeHead(302, {Location: `/?id=${post.id}`});
              response.end();
		  })
      });
}
exports.delete_process = function(request,response){
	var body = '';
    request.on('data', function(data){
          body = body + data;
      });
    request.on('end', function(){
			  var post = qs.parse(body);
			  connection.query(`DELETE FROM topic WHERE id=?`,[post.id],function(error,result){
				  if(error){
					  throw error;
				  }
				  response.writeHead(302, {Location: `/`});
				  response.end();
			  })
      });
}
