## 项目简介

本项目使用vue-cli工具构建，支持热更新热重载，使用开源项目d2admin作为管理后台开发模板，核心组件库为element ui。

## 与上次版本最大的不同

- 取消版本库中的配置文件，增加配置文件模板(`.gitonly文件`)，初始化项目配置文件使用 `npm run init` 命令，生成的配置文件只存在本地，不会提交到版本库中。

## 快速开发向导

- 1、绑定host `127.0.0.1 ww.testdev.fun`、`127.0.0.1 xtadmin.testdev.fun``
- 2、配置nginx（详见文档）
- 3、拉取代码到本地
- 4、安装项目依赖  `npm install`
- 5、初始化配置文件  `npm run init`
- 6、启动开发模式  `npm run dev`
- 7、浏览器访问  http://wwa.fibtc.com/
- 8、生产环境文件打包`npm run build`
- 9、提交代码 `git push`

## 初始化配置文件

以下配置文件`不存在`版本库中，请手动复制模板文件或使用脚本初始化后使用。

```
'./vue.config.js',
'./src/config/env/test.js',
'./src/config/env/production.js',
'./src/config/env/development.js',
```

配置文件模板以`.gitonly`后缀标识，表示这个文件只在版本库内存在（不要删除），自己的配置文件在本地即可，不用提交到版本库，项目有脚本可以快速初始化配置文件：

```
// 初始化配置文件
npm run init
```

## 配置文件修改（开发环境：development.js）
```
注意：此配置是依据现在测试环境配置而配置
ENV: 'w',
DOMAIN_WWW: 'http://admin.btbt.com',
```


## 环境配置

1.hosts配置

```
127.0.0.1       ww.btbt.com
127.0.0.1       admin.btbt.com
127.0.0.1(根据具体服务器ip配置) socket.btbt.com
```

2.nginx配置

注意：请修改对应的root目录路径，若无法访问请检查nginx配置文件的权限是否设置。

```
server {
    listen 80;
    server_name ww.btbt.com;
    location / {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:4004/;
    }
    location /src {
        root /Users/guanxiao/Desktop/code/ex-front-xt-last/public;
    }
    location /lib {
        root /Users/guanxiao/Desktop/code/ex-front-xt-last/public;
    }
    location /dist {
        root /Users/guanxiao/Desktop/code/ex-front-xt-last/public;
    }
    location /exchange-main/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8075/;
        #proxy_pass https://www.fibtc.com/exchange-main/;
    }
    location /exchange-user/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8084/;
        #proxy_pass https://www.fibtc.com/exchange-user/;
    }
    location /exchange-trade/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8082/;
        #proxy_pass https://www.fibtc.com/exchange-trade/;
    }
    location /exchange-otc/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8083/;
        #proxy_pass https://www.fibtc.com/exchange-otc/;
    }

    location = /50x.html {
        root html;
    }
    error_page 500 502 503 504  /50x.html;
}


server {
    server_name admin.btbt.com;
    client_max_body_size 100m;
    client_body_buffer_size 100m;
    listen 80; # managed by Certbot

    location /admin/trade/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8076;
    }
    location /admin/wallet/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8077;
    }
    location /admin/fiat/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8083;
    }
    location /admin/message/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8086;
    }
    location /admin/lever/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8087;
    }
    location /admin/user/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8084;
    }
    location /admin/config/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.201:8085;
    }
    location /admin/activity/ {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://192.168.3.205:8073;
    }
    location /admin {
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_pass http://192.168.3.201:8081;
    }
   location / {
             proxy_pass_header Server;
             proxy_set_header Host $http_host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_pass http://127.0.0.1:3094/;
        }
}

server {
    listen 80;
    server_name f.xt.com;
    location / {
        proxy_pass_header Server;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://127.0.0.1:8081/;
    }
    location = /50x.html {
        root html;
    }
    error_page 500 502 503 504  /50x.html;
}


```

## 开发命令

### npm run dev

注意：在执行npm run dev前，请项目目录下创建一个空的dist文件，否则会报错

开发环境对应配置文件为`./src/config/env/development.js`。

### npm run build

该命令打包生产环境的包，对应配置文件为`./src/config/env/production.js`。

### 打包发布

`./dist`目录不要提交到版本库，打包完毕会自动压缩该目录，生成`./dist.zip`压缩文件，将该文件提交到版本库即可。



