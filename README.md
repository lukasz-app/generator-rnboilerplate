# Rn Boilerplate Generator

This is a react native biolerplate generator. It aims to speed up setting up rn project.

## Installation

First, install [node.js](https://nodejs.org/) and [Yeoman](http://yeoman.io)

```bash
npm install -g yo
```

This generator is not listed in npm, so you need to link it locally.

```bash
git clone REPO_LINK
cd generator-rnboilerplate
npm link
```

Then run generator from parent directory of your future React Native project.

```bash
yo rnboilerplate
```

### This generator will automatically:

create a new directory

run `react-native init --template typescrit` (lukaszchopinfork) in it

run cleaning script provided by prevoius command

create git repository

commit created files

create README file

... more to come

## Getting To Know Yeoman

- Yeoman has a heart of gold.
- Yeoman is a person with feelings and opinions, but is very easy to work with.
- Yeoman can be too opinionated at times but is easily convinced not to be.
- Feel free to [learn more about Yeoman](http://yeoman.io/).
