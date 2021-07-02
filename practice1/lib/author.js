var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');

exports.home = function(request, response){
  db.query(`SELECT * FROM topic`, function(err,topics){//콜백 함수 파라미터는 약속된 것
    db.query(`SELECT * FROM author`, function(err2,authors){
      var title = 'Welcome';
      var list = template.List(topics);//원랜 이거:var list = template.List(filelist);
      var html = template.HTML(title, list,
        `
        ${template.authorTable(authors)}
        <style>
          table{
            border-collapse : collapse;
          }
          td{
            border:1px solid black;
          }
        </style>

        <form action = "/author/create_process" method ="post">
          <p><input type="text" name="name" placeholder="이름"></p>
          <p><textarea name="profile" placeholder="직업 설명"></textarea></p>
          <p><input type="submit" value="create"></p>
        </form>
        `,
        ''
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}


exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data){ //데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
    body = body + data;
    if(body.length > 1e6){
      request.connection.destroy();
    }
  });
  request.on('end', function(){//이벤트라고 불림
    var post = qs.parse(body);
    db.query(`
      INSERT INTO author (name, profile) VALUES(?,?)`,
      [post.name, post.profile],
      function(err,results){
        if(err) throw err;
        response.writeHead(302, {Location : `/author`});//results.insertId : 테이블에 삽입된 데이터의 id값을 갖고오는 약속
        response.end();
      }
    )
  });
}

exports.update = function(request, response){
  db.query(`SELECT * FROM topic`, function(err,topics){//콜백 함수 파라미터는 약속된 것
    db.query(`SELECT * FROM author`, function(err2,authors){
      var _url = request.url;
      var queryData = url.parse(_url, true).query;
      console.log(queryData);
      // var title = queryData.id;
      db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(err3,author){
        var title = 'Author';
        var list = template.List(topics);//원랜 이거:var list = template.List(filelist);
        var html = template.HTML(title, list,
          `
          ${template.authorTable(authors)}
          <style>
            table{
              border-collapse : collapse;
            }
            td{
              border:1px solid black;
            }
          </style>

          <form action = "/author/update_process" method ="post">
            <p><input type="hidden" name="id" value="${queryData.id}"></p>
            <p><input type="text" name="name" value="${author[0].name}"  placeholder="이름"></p>
            <p><textarea name="profile" placeholder="직업 설명">${author[0].profile}</textarea></p>
            <p><input type="submit" value="update"></p>
          </form>
          `,
          ''
        );
        response.writeHead(200);
        response.end(html);
      })
    });
  });
}


exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data){ //데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
    body = body + data;
    if(body.length > 1e6){
      request.connection.destroy();
    }
  });
  request.on('end', function(){//이벤트라고 불림
    var post = qs.parse(body);
    db.query(`
      UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      function(err,results){
        if(err) throw err;
        response.writeHead(302, {Location : `/author`});//results.insertId : 테이블에 삽입된 데이터의 id값을 갖고오는 약속
        response.end();
      }
    )
  });
}

exports.delete_process = function(request, response){
  var body = '';
  request.on('data', function(data){ //데이터가 들어오면 조각조각의 데이터를 수신할 때만다 콜백함수를 호출하는데 이 때 data라는 변수를 통해 주기로 약속
    body = body + data;
    if(body.length > 1e6){
      request.connection.destroy();
    }
  });
  request.on('end', function(){//이벤트라고 불림
    var post = qs.parse(body);
    db.query(`
      DELETE FROM author WHERE author_id = ?`,
      [post.id],
      function(err,results){
        if(err) throw err;
        response.writeHead(302, {Location : `/author`});//results.insertId : 테이블에 삽입된 데이터의 id값을 갖고오는 약속
        response.end();
      }
    )
  });
}
