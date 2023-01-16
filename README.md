# Agnostic-Package-Manager
A small wrapper around npm, yarn and pnpm to make jumping between projects with different managers a little easier

## WARNING: This is _super alpha_ and hasn't been battle tested at all.

## Setup:
To setup, clone this repo and then run 
```shell
npm run init
```
This will make the cli script executable and add the `apm` command to your path (via `npm link`).

## Usage:
To use this tool, simply replace the specific package manager command with this agnostic one. 

To see the command mappings, run `apm --help`.

### Example:
To add react, in an npm project you might run:
```shell
npm install react
```
Or in yarn:
```shell
yarn add react
```

In `apm`, run:
```shell
apm add react
```
and it'll see what package manager you're running in your project and execute the correct command. 