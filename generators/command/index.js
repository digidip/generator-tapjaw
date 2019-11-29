const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

module.exports = class extends Generator {
    initializing() {
        this.log(`Add new Tapjaw Command in project: ${chalk.green(this.contextRoot)}`);

        let error = false;
        if (!fs.existsSync(`${this.contextRoot}/src/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/')}" directory.`);
            error = true;         
        }

        if (!fs.existsSync(`${this.contextRoot}/src/commands/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/commands/')}" directory.`);
            error = true;
        }
        if (error) process.exit(1);
    }

    async createCommand() {
        this.commandName = await this.prompt({
            type: 'input',
            name: 'commandName',
            message: 'Enter the name of your new command (us hyphen case, e.g. "my-test")',
            require: true,
        });

        // does file class exist?
        this.filename = this.contextRoot + '/src/commands/' + this.commandName.commandName + '.ts';
        if (fs.existsSync(this.filename)) {
            this.log.error(`${chalk.red.italic(this.filename)} already exists. Terminating!`);
            process.exit(1);
        }
        
        this.log(`Creating command: ${chalk.green.bold(this.filename)} - class name will be "${chalk.yellowBright.bold('class ' + _.chain(this.commandName.commandName).camelCase().upperFirst() + ' extends TapjawCommand { ... }')}".`);
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('command.ts'),
            this.destinationPath(`src/commands/${this.commandName.commandName}.ts`),
            {
                commandname: this.commandName.commandName,
                classname: _.chain(this.commandName.commandName).camelCase().upperFirst()
            }
        )
    }

    end() {
        this.log(`Command has been succesfully created at ${chalk.green.italic(this.filename)}.`);
    }
};
