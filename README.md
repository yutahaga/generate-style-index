# generate-style-index

指定したディレクトリのサブディレクトリ以下の CSS ファイルを全て `@import` する索引ファイルを生成します。

索引ファイルを作成することで、 `import-glob-loader` などを利用しないでコンパイル可能になり、再利用しやすくなります。

## インストール

```sh
yarn add @yutahaga/generate-style-index
```

## 使い方

```sh
node node_modules/.bin/generate-style-index.js -v -s sass -p src/styles
```

または `package.json` の `scripts` フィールドに

```json
{
  "scripts": {
    "gsi": "generate-style-index -v -s sass -p src/styles"
  }
}
```

のように記載し、書きのように実行してください。

```sh
yarn gsi
```

## コマンドライン引数

### -v, --verbose

生成したファイルなどを標準出力に出力します。

### -s [syntax], --syntax [syntax]

構文を指定できます。初期値は `css`。

対応している構文は、
`css, sass, scss, less, stylus`
です。

### -p [directory], --path [directory]

プロジェクトルートから見た相対パスを指定できます。初期値は `src/styles`。
