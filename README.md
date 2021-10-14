# typescript-todo-or-die-plugin

`TODO`'s that speak up for themselves via the TypeScript Language Server.

## Examples

```typescript
// Will result in your editor showing an error: "It's time to do it!"
// TODO::after_date("2021-04-02"): remove april fools code
```

```typescript
// Will result in your editor showing an error:
// "Your package has arrived! now on 4.5.1"
// FIXME::when("typescript", ">4.5.0"): check your types
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
          },
          "when": {
            "warn": "1p"
          }
        },
        "additionalKeywords": ["FIX", "TODO_OR_DIE"]
      }
    ]
  }
}
```

3. Add `TODO`'s with conditions to your codebase

**Note**: If you're using Visual Studio Code, you'll have to run the "TypeScript: Select TypeScript Version" command and choose "Use Workspace Version", or click the version number next to "TypeScript" in the lower-right corner. Otherwise, VS Code will not be able to find your plugin.

## Conditions

The following conditions are available to use inside your `TODO` comments

### `after_date(date)`

| Param | Type         | Description                              |
| ----- | ------------ | ---------------------------------------- |
| date  | `yyyy-mm-dd` | Date after which an error will be shown. |

Show an error if today is after the given date

##### Configuration options:

- **warn?**: string | boolean (Ex: '1w'/'2d'/'30h'/true)

Show a warning before the given date

### `when(package, version)`

| Param   | Type     | Description                                                     |
| ------- | -------- | --------------------------------------------------------------- |
| package | string   | Package name to be tracked as defined in the package.json file. |
| version | `>1.0.0` | A comparator (`>` or `=`) followed by the version to be matched |

Show an error when version is compared with the current version as defined in the
`package.json` file.

##### Configuration options:

- **warn?**: string | boolean (Ex: '1M'/'2m'/'4p'/true)

Show a warning before the given version matching on M - major versions, m -
minor versions, p - patches. Defaults to 1 patch ahead when `warn` option is present.

### `on_branch(branch_name)`

| Param        | Type         | Description                                 |
| ------------ | ------------ | ------------------------------------------- |
| branch_name  | string       | Git branch, on which an error will be shown |

Show an error if current git branch matches specified one

## Additional keywords

By default `TODO` & `FIXME` are valid keywords to use for your todo comments. Additional keywords can be added as shown here:

```json
"plugins": [
  {
    "name": "typescript-todo-or-die-plugin",
    "additionalKeywords": ["FIX", "TODO_OR_DIE"]
  }
]
```

## Contributors

<a href="https://github.com/ngnijland/typescript-todo-or-die-plugin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ngnijland/typescript-todo-or-die-plugin" />
</a>

Made with [contributors-img](https://contrib.rocks).
