var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');
var qs = require('querystring');
var db = require('./lib/db');

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i<filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
    i++;
  }
  var list = list + '</ul>';
  return list;
}

function templateTable(result){
  var tag =`
  <table>
  <tr>
    <td>글 제목</td>
    <td>내용</td>
    <td>작성자</td>
    <td>날짜</td>
    <td>수정</td>
    <td>삭제</td>
  </tr>
  `
  var i = 0;
  while(i<result.length){
    tag = tag + `
      <tr>
        <td>${result[i].title}</td>
        <td><a href="/viewPage">${result[i].description}</a></td>
        <td>${result[i].name}</td>
        <td>${result[i].date}</td>

        <td><a href="/update?id=${result[i].id}"><input type="button" value="수정"></a>
        </td>

        <td>
          <form action = "/delete_process" method = "post">
            <input type = "hidden" name = "id" value = "${result[i].id}">
            <input type="submit" value="삭제" onclick="alert('정말 삭제하시겠습니까?')">
          </form>
        </td>
      <tr>
      `;
    i ++;
  }
  tag = tag + '</table>';
  return tag;
}

function templateHTML(title, list, table, form, control){
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">게시판</a></h1>
    ${list}
    <h2>${title}</h2>
    ${table}
    ${control}
    ${form}
  </body>
  </html>

  `;
  return template;
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id; // /?id=아이디값
    console.log(url.parse(_url, true));
    if(pathname === '/'){
      if(title === undefined){
        fs.readdir('./data', function(err, filelist){
          db.query('SELECT * FROM board', function(err, result){
            if(err) throw err;
            // console.log(result);
            var title = '게시판 리스트';
            var list = templateList(filelist);
            var table = `
            ${templateTable(result)}

            <style>
              table{border-collapse : collapse;}
              td{border:1px solid black;}
            </style>
            `;

            var html = templateHTML(title,list,table,'',
              '<p><a href="/write"><input type="submit" value="글쓰기"></a></p>');

            response.writeHead(200);
            response.end(html);
          });
        });
      }

      else{
        fs.readdir('./data', function(err, filelist){
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,data){
            if(err) throw err;
            var list = templateList(filelist);
            var html = templateHTML(title, list, '', data);

            response.writeHead(200);
            response.end(html);
          });
        });
      }

    }
    else if(pathname === '/create_process'){
        var body = '';
        request.on('data', function (data) {
          body += data;
          if (body.length > 1e6){
              request.connection.destroy();
          }
        });
        request.on('end', function () {
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          var name = post.name;
          db.query('INSERT INTO board(title, description, name, date) VALUES(?,?,?,NOW())',
            [title, description, name],
            function(err, result){
              if(err) throw err;
              console.log(result);
            });
        });
        response.writeHead(302, {Location: '/'});
        response.end();

    }
    else if(pathname === `/update`){
      fs.readdir('./data', function(err, filelist){
          if(err) throw err;
        db.query('SELECT * FROM board', function(err2, result){
          if(err2) throw err2;
          var _title = '게시판';
          var list = templateList(filelist);
          var table = `
          ${templateTable(result)}

          <style>
            table{border-collapse : collapse;}
            td{border:1px solid black;}
          </style>
          `; //테이블 표시
          db.query('SELECT * FROM board WHERE id = ?',[queryData.id], function(err3,results){
            if(err3) throw err3;
            console.log(results);

            var form = `
              <form action = "/update_process"  method = "post">
                <p>글 제목</p>
                <input type ="hidden" name="id" value="${results[0].id}">
                <p><input type = "text" name = "title" placeholder = "글 제목" value="${results[0].title}">
                </p>
                <p>내용</p>
                <p><textarea name="description" placeholder="내용을 입력하세요." cols="50" rows="3">${results[0].description}</textarea>
                </p>
                <p>작성자</p>
                <p><input type = "text" name = "name" placeholder = "작성자 이름" value="${results[0].name}">
                </p>
                <input type = "submit" value = "작성 완료">
              </form>
            `;
            var html = templateHTML(_title,list,table,form,'');

            response.writeHead(200);
            response.end(html);
          });
        });
      });
    }
    else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function (data) {
        body += data;
        if (body.length > 1e6){
            request.connection.destroy();
        }
      });
      request.on('end', function () {
        var post = qs.parse(body);
        db.query('UPDATE board SET title=?, description=?, name=?, date=NOW() WHERE id=?',
          [post.title, post.description, post.name, post.id],
          function(err, result){
            if(err) throw err;
            console.log(result);
          });
      });
      response.writeHead(302, {Location: '/'});
      response.end();
    }
    else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function (data) {
        body += data;
        if (body.length > 1e6){
            request.connection.destroy();
        }
      });
      request.on('end', function () {
        var post = qs.parse(body);
        db.query('DELETE FROM board WHERE id=?',
          [post.id],
          function(err, result){
            if(err) throw err;
            console.log(result);
          });
      });
      response.writeHead(302, {Location: '/'});
      response.end();
    }
    else if(pathname === '/write'){
          var title = '글 쓰기';
          var form = `
            <form action = "/create_process"  method = "post">
              <p>글 제목</p>
              <p><input type = "text" name = "title" placeholder = "글 제목">
              </p>
              <p>내용</p>
              <p><textarea name="description" placeholder="내용을 입력하세요." cols="50" rows="3"></textarea>
              </p>
              <p>작성자</p>
              <p><input type = "text" name = "name" placeholder = "작성자 이름">
              </p>
              <input type = "submit" value = "작성 완료">
            </form>
          `;
          var html = templateHTML(title,'','',form,'');

          response.writeHead(200);
          response.end(html);
    }
    else if(pathname === '/viewPage'){
      db.query('SELECT * FROM board WHERE id = ?',[queryData.id], function(err,results){
        if(err) throw err;
        console.log(results);

        // var form = `
        //
        //     <p>글 제목</p>
        //
        //     <p><input type = "text" name = "title" placeholder = "글 제목" value="${results[0].title}">
        //     </p>
        //     <p>내용</p>
        //     <p><textarea name="description" placeholder="내용을 입력하세요." cols="50" rows="3">${results[0].description}</textarea>
        //     </p>
        //     <p>작성자</p>
        //     <p><input type = "text" name = "name" placeholder = "작성자 이름" value="${results[0].name}">
        //     </p>
        //     <input type = "submit" value = "작성 완료">
        //
        // `;
        // var html = templateHTML('','','',form,'');
        //
        // response.writeHead(200);
        // response.end(html);
      });
    }
    else{
      response.writeHead(404);
      response.end('Not Found');
    }
});
app.listen(3000);
