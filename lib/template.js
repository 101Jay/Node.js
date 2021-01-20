var sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
	<p><a href="/author">author</a></p>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authorSelect : function(authors, author_id){
	  var tag = '';
	  var i = 0;
	  while(i<authors.length){
		  var selected = '';
		  if(authors[i].id === author_id){
			  selected = ' selected';
		  }
		  tag = tag + `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`
		  i = i+1;
	  }
	  var tag2 = `<p>
				<select name="author" >
					${tag}
				</select>
		   </p>`
	  return tag2;
  	}, authorTable : function(authors){
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
			var delete_form = `
						<form action="/author/delete_process?id=${authors[i].id}" method="post">
						<p><input type="hidden" name="id" value="${authors[i].id}"></p>
						<p><input type="submit" value="delete"></p>
						</form>`;
					
			table = table + `
					<tr>
						<td>${sanitizeHtml(authors[i].name)}</td>
						<td>${sanitizeHtml(authors[i].profile)}</td>
						<td><a href = "/author/update?id=${authors[i].id}">update</a></td>
						<td>${delete_form}</td>
					</tr>
				`;
			i = i+1;
		}
		table = table + '</table>';
		return table;
	},
}
