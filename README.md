### 项目运行

```
cp .env.example .env //設置站點資訊

npm install

npm run build

npm run start //6868 & 6869 port
```

6868解析到主域名
解析6869 port到特定子域名(wxchat2)

例如：
www.wechat.com  <= 6868
wxchat2.wechat.com <= 6869

