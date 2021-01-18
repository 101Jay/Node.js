var connection = require('./db.js');
var template = require('./template.js');
var qs = require('querystring');

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
				var table = `
				<table border=1, style="border-collapse:collapse">
					<tr>
						<th>Name</th>
						<th>Profile</th>
						<th>Update</th>
						<th>Delete</th>
					</tr>
				`;

				var i = 0;
				while(i<authors.length){
					table = table + 
				`
					<tr>
						<td>${authors[i].name}</td>
						<td>${authors[i].profile}</td>
						<td><a href = "/update?id=${authors[i].id}">update</a></td>
						<td><a href = "/delete_process">delete</a></td>
					</tr>
				`;
					i = i+1;
				}
				table = table + '</table>';

				if(queryData_id === undefined){
					var namevalue = "";
					var profile = "";
					var submit = 'create';
				}else{
					var namevalue = author[0].name;
					var profile = author[0].profile;
					var submit = 'update';
				} //here we start

				var list = template.list(topics);
				var html = template.HTML(title, list,
				`
				<form action="/author/create_process" method="post">
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

			