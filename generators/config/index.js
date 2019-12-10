const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');
const fs = require('fs');
const BaseGenerator = require('../base');

module.exports = class extends BaseGenerator {
    initializing() {
        this.log(`Add new Tapjaw Config in project: ${chalk.green(this.contextRoot)}`);

        let error = false;
        error = this._checkForDirectorySrc(error);
        error = this._checkForDirectoryConfigs(error);

        if (error) process.exit(1);
    }

    async defineConfigClass() {
        this.args = await this.prompt([
            {
                type: 'input',
                name: 'className',
                message: 'Enter the name of your new config (us hyphen case, e.g. "my-test")',
                require: true,
            },
            {
                type: 'input',
                name: 'namespace',
                message: 'Enter the configuration namespace (e.g. TAPJAW_SCOPE, only letters/numbers/underscores in upper case)',
                require: true,
            },
        ]);
    }

    async defineConfigs() {
        const addProperties = await this.prompt({
            name: 'decision',
            message: `Would you like to add configurations to "${this.args.namespace}_*"?`,
            require: true,
            default: false,
            type: 'confirm',
        });

        this.configs = [];
        if (addProperties.decision) {
            const questions = [
                {
                    name: 'configName',
                    message: 'Enter config name (Use only letters/numbers/underscores in upper case, e.g. NAME):',
                    type: 'input',
                    require: true,
                    validate: (input) => {
                        return /[A-Z0-9_]+/.test(input);
                    }
                },
                {
                    name: 'configValue',
                    message: `Enter config value:`,
                    type: 'input',
                    require: true,
                },
                {
                    name: 'addAnother',
                    message: 'Add another configuration?',
                    require: true,
                    default: true,
                    type: 'confirm'
                }
            ];

            const ask = async () => {
                await inquirer.prompt(questions).then(async result => {
                    this.configs.push(`${this.args.namespace}_${String(result.configName).toUpperCase()}=${result.configValue}`);

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
            this.templatePath('config.ts'),
            this.destinationPath(`src/configs/${this.args.className}-config.ts`),
            {
                classname: _.chain(this.args.className).camelCase().upperFirst(),
                name: _.chain(this.args.className).replace('-', ' ').upperFirst(),
                namespace: String(this.args.namespace).toUpperCase(),
            }
        );

        if (!fs.existsSync(this.contextRoot + '/.env')) {
            this.log('File does not exist, creating new .env file.');
            // copy and fill template
            this.fs.copyTpl(
                this.templatePath('.env'),
                this.destinationPath('.env'),
                {
                    configs: this.configs.length > 0 ? this.configs.sort().map(config => config).join('\n') : '',
                }
            )
        } else {
            this.log('.env file already exists, appending with new configurations.');
            // append existing log
            if (this.configs.length > 0) {
                this.fs.append(this.destinationPath('.env'), this.configs.sort().map(config => config).join('\n'), { trimEnd: false, force: true });
            }
        }
    }

    end() {
        this.log(`New config has been succesfully created.`);
    }
};
