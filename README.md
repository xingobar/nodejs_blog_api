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
