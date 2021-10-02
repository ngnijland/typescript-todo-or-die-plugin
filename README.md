# typescript-todo-or-die-plugin

`TODO`'s that speak up for themselves via the TypeScript Language Server.

## Examples

```typescript
// Will result in your editor showing an error: "It's time to do it!"
// TODO::after_date("2021-04-02"): remove april fools code
```

## Usage

This plugin requires a project with TypeScript setup.

1. Install dependency

```bash
npm install --save-dev typescript-todo-or-die-plugin
```

or

```bash
yarn add typescript-todo-or-die-plugin --dev
```

2. Add a plugins section to your tsconfig.json.

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-todo-or-die-plugin",
        "options": {
          "after_date": {
            "warn": "1w"
          }
        }
      }
    ]
  }
}
```

3. Add `TODO`'s with conditions to your codebase

## Conditions

The following conditions are available to use inside your `TODO` comments

### `after_date(date)`

Param | Type | Description
---|---|---
date | `yyyy-mm-dd` | Date after which an error will be shown.

Show an error if today is after the given date

##### Configuration options:
- **warn?**: string | boolean (Ex: '1w'/'2d'/'30h'/true)

## Contributors

<a href="https://github.com/ngnijland/typescript-todo-or-die-plugin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ngnijland/typescript-todo-or-die-plugin" />
</a>

Made with [contributors-img](https://contrib.rocks).
