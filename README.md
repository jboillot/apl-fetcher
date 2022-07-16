# APL-Fetcher

This small project retrieves the amount of APL on the CAF website according to the input parameters using playwright.

## How to install

Install the dependencies:

```
npm ci
```

In order to build:

```
npm run build
```

In order to format (before any commit):

```
npm run format
```

## How to use

```
npm run start
```

You can change the input parameters in `src/index.ts` with the variable `test`.

By default, the browser is not shown, you can change that by modifying the value associated to `headless` in `src/index.ts`.

## Contributing

Feel free to contribute to this project, fork and pull request your ideas.
Don't include work that is not open source or not from you.
