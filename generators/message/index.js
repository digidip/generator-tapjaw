const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');
const fs = require('fs');
const BaseGenerator = require('../base');

module.exports = class extends BaseGenerator {
    initializing() {
        this.log(`Add new Tapjaw Connector in project: ${chalk.green(this.contextRoot)}`);

        let error = false;
        error = this._checkForDirectorySrc(error);
        error = this._checkForDirectoryContracts(error);

        if (error) process.exit(1);
    }

    async defineMessage() {
        this.args = await this.prompt({
            name: 'messageName',
            type: 'input',
            message: 'Enter the name of your new message (us hyphen case, e.g. "my-test")',
            require: true,
        });
    }

    async defineProperties() {
        const addProperties = await this.prompt({
            name: 'decision',
            message: 'Would you like to add properties to your new message?',
            require: true,
            default: true,
            type: 'confirm',
        });

        if (addProperties.decision) {
            const questions = [
                {
                    name: 'property',
                    message: 'Enter property Typescript schema: (e.g.: "myProp: string" or "myProp: CustomType")',
                    type: 'input',
                    validate: (input) => {
                        const parts = input.split(':');
                        return parts.length === 2;
                    }
                },
                {
                    name: 'addAnother',
                    message: 'Add another property?',
                    require: true,
                    default: true,
                    type: 'confirm'
                }
            ];

            this.properties = [];
            this.customTypes = [];
            const ask = async () => {
                await inquirer.prompt(questions).then(async result => {
                    const [ prop, type ] = result.property.replace(/\ ;/g, '').split(':');
                    console.log(type.toLowerCase().replace(/\[\]/g, ''));
                    if (['string', 'number', 'boolean', 'null', 'undefined'].indexOf(type.toLowerCase().replace(/\[\]/g, '').trim()) === -1) {
                        // custom type
                        this.customTypes.push(type.toLowerCase().replace(/\[\]/g, '').trim());
                    }

                    this.properties.push(result.property);

                    if (result.addAnother) {
                        await ask();
                    }
                });
            }

            await ask();
        }
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('message.ts'),
            this.destinationPath(`src/contracts/${this.args.messageName}-message.ts`),
            {
                classname: _.chain(this.args.messageName).camelCase().upperFirst(),
                properties: this.properties,
                interfaces: this.customTypes,
            }
        );
    }

    end() {
        this.log(`Message has been succesfully created at ${chalk.green.italic(this.destinationPath(`src/contracts/${this.args.messageName}-message.ts`))}.`);
    }
};
