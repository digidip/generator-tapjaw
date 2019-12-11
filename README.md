# Tapjaw Project Generator

This package is a yeomen generator for creating a new TapjawImporter project and adding connectors, commands, adapters and message contracts.

<!-- toc -->
- [Tapjaw Project Generator](#tapjaw-project-generator)
- [TapjawImporter](#tapjawimporter)
- [Install & Usage](#install--usage)
  - [1: Install Yeoman](#1-install-yeoman)
  - [2: Install Tapjaw Generator](#2-install-tapjaw-generator)
  - [3: Setup a new project](#3-setup-a-new-project)
<!-- tocstop -->

# TapjawImporter

The TapjawImporter is a simple utility framework for downloading API responses and transfering each entity from the response into a message style object and write it to the STDOUT buffer as JSON, allowing for possibilites of piping data into storage interfaces, processors or analysis tools.

# Install & Usage

TapjawImporter is a library package which is used in conjunction with a project, if you wish to create a project and start using the TapjawImporter, you will need to install [Yeoman](https://github.com/yeoman/yo) and the [Tapjaw Generator](https://github.com/digidip/generator-tapjaw).

Before we start, it's recommended you [install yarn](https://yarnpkg.com/en/docs/install) in your development environment.

## 1: Install Yeoman

```bash
~ $> yarn global add yo
```

## 2: Install Tapjaw Generator

```bash
~ $> yarn global add generator-tapjaw
```

To make sure the TapjawGenerator is working, execute the following command to see if the help output is displayed.

```bash
~ $> yo tapjaw
Tapjaw Project Generator
$ yo tapjaw:adapter         Create a new adapter
$ yo tapjaw:config          Create a new configuration scope
$ yo tapjaw:command         Create a new command
$ yo tapjaw:connector       Create a new connector
$ yo tapjaw:message         Create a new message
$ yo tapjaw:new-project     Create a new project tree
```

## 3: Setup a new project

Firstly `cd` to your workspace or development directory.

```bash
~/workspace $> yo tapjaw:new-project
```

Follow the instructions issued by the generator command, once you've generated a new project, `cd` into the project directory and install the project's dependancies.

```bash
~/workspace/my-project $> yarn install
```

To make sure the project has been setup correctly, issue the following command:

```bash
~/workspace/my-project $> bin/run
```

You should see a similar output:

```bash
testing description

VERSION
  testing/0.1.0 darwin-x64 node-v10.16.0

USAGE
  $ testing [COMMAND]

COMMANDS
  help  display help for testing
```

You are now ready to start working on your project.
