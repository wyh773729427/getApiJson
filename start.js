const http = require('http');
const url = require('url');

const fs = require('fs');
const filename = 'data.json';

function saveFile(res) {
	// 读取文件中的数据
	fs.readFile(filename, 'utf8', (err, data) => {
	    if (err) {
	        if (err.code === 'ENOENT') {
	            // 如果文件不存在，创建一个空的 JSON 对象
	            const initialData = {};
	            writeDataToFile(filename, initialData);
	        } else {
	            console.error('Error reading file:', err);
	        }
	    } else {
	        let jsonData = {};
	        try {
	            jsonData = data ? JSON.parse(data) : {}; // 解析 JSON 数据
	        } catch (parseError) {
	            console.error('Error parsing JSON:', parseError);
	            return;
	        }
	        
	        // 修改 JSON 数据
			if(res.pageData.pageTitle) {
				if(!jsonData[res.pageData.pageTitle]) {
					jsonData[res.pageData.pageTitle] = {
						'页面名称': res.pageData.pageTitle,
						'页面路径': res.pageData.path,
						'页面name': res.pageData.name,
						'页面请求': [],
					}
				}
				
				pageUrlList(jsonData[res.pageData.pageTitle]['页面请求'], res.response);
			}
			
	        
	        // 将修改后的数据写入文件
	        writeDataToFile(filename, jsonData);
	    }
	});
}

function pageUrlList(list, res) {
	let has = false;
	let i = 0;
	for(; i < list.length; i++) {
		let item = list[i];
		if(item['请求路径'] == res.config.url) {
			break;
		}
	}
	if(i == list.length) {
		let cs = res.config.params;
		if(res.config.method == 'post') {
			try {
			  cs = res.config.data ? JSON.parse(res.config.data) : '';
			}
			catch (error) {
			  cs = res.config.data
			}
		}
		list.push({
			'请求路径': res.config.url,
			'请求方式': res.config.method,
			'请求参数': cs,
			'返回结果': res.data,
		})
	}
	return list;
}

// 将数据写入文件的函数
function writeDataToFile(filename, data) {
    fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File updated successfully.');
        }
    });
}

const server = http.createServer((req, res) => {

  // 设置响应头允许跨域访问
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', '*'); // 添加 Pragma 请求头
 
   const parsedUrl = url.parse(req.url, true);
   const pathname = parsedUrl.pathname;
 
   if (req.method === 'OPTIONS') {
     // 处理预检请求
     res.writeHead(200, {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
       'Access-Control-Allow-Headers': '*', // 添加 Pragma 请求头
     });
     res.end();
     return;
   }

  if (pathname === '/api/get' && req.method === 'GET') {
    // 处理 GET 请求
    const responseData = { message: 'This is a GET request response' };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseData));
  } else if (pathname === '/api/post' && req.method === 'POST') {
    // 处理 POST 请求
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
		if(data.response.status == '200') {
			saveFile(data);
		}
		
		
        const responseData = { message: 'This is a POST request response', data };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
  } else {
    // 处理其他请求
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
