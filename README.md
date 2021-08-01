簡單文章 api

# graphql docs

```
 1. https://www.apollographql.com/docs/apollo-server/getting-started/
```

# run graphql

```
npm run dev:graphql
```

# swagger url

```
http://localhost:8001/api-docs/swagger
```

| 功能                 | api                                                                    |
| -------------------- | ---------------------------------------------------------------------- |
| 登入                 | [POST]/api/auth/login                                                  |
| 註冊                 | [POST]/api/auth/register                                               |
| 取得文章             | [GET] /api/posts                                                       |
| 取得會員資料         | [GET] /api/users                                                       |
| 儲存個人資料         | [POST] /api/users/profile                                              |
| 取得個人資料         | [GET] /api/users/profile                                               |
| 新增文章             | [POST] /api/users/posts                                                |
| 更新文章             | [PUT] /api/users/posts                                                 |
| 刪除文章             | [DELETE] /api/users/posts                                              |
| 顯示文章             | [GET] /api/posts/{postId}                                              |
| 喜歡文章             | [POST] /api/posts/{postId}/likes                                       |
| 加入書籤             | [POST] /api/posts/{postId}/bookmarks                                   |
| 觀看次數的文章       | [GET] /api/posts/{postId}/popularity                                   |
| 其他人也觀看的文章   | [GET] /api/posts/{postId}/recommends                                   |
| 取得使用者自己的文章 | [GET] /api/users/posts                                                 |
| 取得使用者收藏的文章 | [GET] /api/users/posts/bookmarks                                       |
| 取得使用者點讚的文章 | [GET] /api/users/posts/likes                                           |
| 上傳圖片             | [POST] /api/uploader/images                                            |
| 取得文章留言         | [GET] /api/posts/{postId}/comments                                     |
| 新增父留言           | [POST] /api/posts/{postId}/comments                                    |
| 更新留言             | [PUT] /api/posts/{postId}/comments/{commentId}                         |
| 刪除父留言           | [DELETE] /api/posts/{postId}/comments/{commentId}                      |
| 新增子留言           | [POST] /api/posts/{postId}/comments/{parentId}/children                |
| 更新子留言           | [PUT] /api/posts/{postId}/comments/{parentId}/children/{childrenId}    |
| 刪除子留言           | [DELETE] /api/posts/{postId}/comments/{parentId}/children/{childrenId} |

# 跑測試前先將 test.ormconfig.json.example cp 一份

```
cp test.ormconfig.json.example test.ormconfig.json
```

# nodejs_blog_api

nodejs + ts + express blog api

```
npm install -g typeorm ts-node
後才可以設定 package.json
```

# package.json typeorm

```
 "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
 "typeorm:migrate": "npm run typeorm migration:generate -- -n"
```

# generate migration

```
npm run typeorm migration:generate -- -n  {migration name}
```

# run migration

```
npm run typeorm migration:run
```

# typeorm migration

```
1. https://typeorm.io/#/migrations/generating-migrations
```

# express decorator

# npm install @decorators/express @decorators/di --save

```
1. https://www.npmjs.com/package/@decorators/express
2. https://github.com/serhiisol/node-decorators/tree/master/express
```

# npm install typeorm reflec-metadata --save

```
1. https://typeorm.io/#/
2. https://github.com/typeorm/typeorm/blob/master/docs/zh_CN/index.md
3. https://medium.com/swlh/migrations-over-synchronize-in-typeorm-2c66bc008e74
4. https://github.com/typeorm/typeorm/blob/master/docs/eager-and-lazy-relations.md
5. https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md
6. https://www.gitmemory.com/issue/typeorm/typeorm/3017/501248107
```

# typeorm migration setting

```
1. https://github.com/typeorm/typeorm/issues/3075
```

# method decorator

```
1. https://devsmitra.medium.com/how-to-make-rest-apis-using-node-js-express-js-typescript-decorators-5fd468e0f3c9
2. https://www.typescriptlang.org/docs/handbook/decorators.html
3. https://jkchao.github.io/typescript-book-chinese/tips/metadata.html#%E5%9F%BA%E7%A1%80
```

# reflect metadata

```
1. https://segmentfault.com/a/1190000037706768
```

# decorator

```
1. https://oldmo860617.medium.com/%E5%8D%81%E5%88%86%E9%90%98%E5%B8%B6%E4%BD%A0%E4%BA%86%E8%A7%A3-typescript-decorator-48c2ae9e246d
```

# npm install class-validator --save

# 驗證 database column

```
1. https://github.com/typestack/class-validator
```

# npm install typeorm-typedi-extensions --save

```
使用 typeorm 可以使用 typedi
1. https://github.com/typeorm/typeorm/issues/487
2. https://github.com/typestack/typedi/issues/4
3. https://www.npmjs.com/package/typeorm-typedi-extensions
```

# npm install --save argon2

```
密碼加密
1. https://www.npmjs.com/package/argon2
```

# add namespace module

```
1. https://stackoverflow.com/questions/44383387/typescript-error-property-user-does-not-exist-on-type-request
```

# typeorm docs

```
1. https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#relationid
2. https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#basic-options
```

# seeder, faker

##### npm install --save typeorm-seeding @types/faker

```
1. https://saveyourtime.medium.com/typeorm-how-to-seed-data-with-typeorm-seeding-8f0f8273e05f
2. https://www.npmjs.com/package/typeorm-seeding
3. https://github.com/w3tecch/typeorm-seeding#cli-configuration
```

##### npm install typeorm-seeding @types/faker --save

```
1.https://saveyourtime.medium.com/typeorm-how-to-seed-data-with-typeorm-seeding-8f0f8273e05f
```

# mocha unittest

###### npm install mocha chai supertest --save

```
1. https://ithelp.ithome.com.tw/articles/10197286
2. https://stackoverflow.com/questions/49794140/connection-default-was-not-found-with-typeorm?fbclid=IwAR1yCUP_0dNRXboiBpfmbaVMiZIl6MXQoE6-TRqmrmwC7IjqYmU0psLtXhI
3. https://stackoverflow.com/questions/45253571/typeorm-with-multiple-env-setups
4. https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46861
5. https://medium.com/twelvefish/%E4%BD%BF%E7%94%A8-typescript-%E6%92%B0%E5%AF%AB-mocha%E6%B8%AC%E8%A9%A6-a4eda437fa53
6. https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
7. https://www.tabnine.com/code/javascript/functions/chai/Assertion/an
```

# npm install typeorm-linq-repository --save

#### 將 typeorm repository 在包裝一層

```
1. https://www.npmjs.com/package/typeorm-linq-repository
```

# npm install --save winston winston-daily-rotate-file

```
1. https://stackoverflow.com/questions/58444404/how-to-seperate-logs-into-separate-files-daily-in-node-js-using-winston-library
2. https://github.com/winstonjs/winston/blob/master/UPGRADE-3.0.md
```

# npm install typeorm-polymorphic --save

```
1. https://www.npmjs.com/package/typeorm-polymorphic
2. https://github.com/typeorm/typeorm/issues/5331
3. https://stackoverflow.com/questions/54246615/what-s-the-difference-between-remove-and-delete
```

# npm install typeorm-pagination --save

### 處理 typeorm 分頁

```
1. https://www.npmjs.com/package/typeorm-pagination

```

# npm install @types/multer --save

```
1. https://www.npmjs.com/package/multer
2. https://www.positronx.io/multer-file-type-validation-tutorial-with-example/
3. https://iamdanielglover.medium.com/implementing-multer-using-a-controller-model-pattern-typescript-4212392cf77c
4. http://expressjs.com/en/resources/middleware/multer.html
5. https://dev.to/joaosczip/build-a-file-upload-service-with-nodejs-typescript-clean-architecture-and-aws-s3-3h9b
6. https://www.digitalocean.com/community/tutorials/nodejs-uploading-files-multer-express
7. https://medium.com/codebase/using-aws-s3-buckets-in-a-nodejs-app-74da2fc547a6
```
