const chalk = require('chalk');
const _ = require('lodash');
const BaseGenerator = require('../base');
const glob = require('glob');
const path = require('path');

module.exports = class extends BaseGenerator {
    initializing() {
        this.log(`Add new Tapjaw Connector in project: ${chalk.green(this.contextRoot)}`);

        let error = false;
        error = this._checkForDirectorySrc(error);
        error = this._checkForDirectoryConnectors(error);
        error = this._checkForDirectoryAdapter(error);

        if (error) process.exit(1);
    }

    async adapterName() {
        this.args = await this.prompt(
            {
                type: 'input',
                name: 'adapterName',
                message: 'Enter the name of your new adapter (us hyphen case, e.g. "my-test")',
                require: true,
            }
        );
    }

    async selectConnector() {
        const connectors = glob
            .sync(this.contextRoot + '/src/connectors/*-connector.ts')
            .map(file => {
                return {
                    label: `${_.upperFirst(_.camelCase(path.basename(file).replace('.ts','')))} (${chalk.italic(path.basename(file))})`,
                    class: _.upperFirst(_.camelCase(path.basename(file).replace('.ts',''))),
                    file: path.basename(file),
                }
            });
        connectors.push({
            label: 'Use adapter specification',
            value: null,
        });

        if (connectors.length > 1) {
            this.connector = await this.prompt({
                type: 'list',
                name: 'connector',
                message: 'Please select the connector you wish to configure the adpater with:',
                choices: connectors.map(connector => ({
                    name: connector.label,
                    value: connector.file,
                })),
            });
        } else {
            this.connector = {};
        }

        if (!this.connector.connector || connectors.length === 1) {
            this.connector.connector = `${this.args.adapterName}-connector.ts`;
        }
    }

    async selectMessageType() {
        const selectMessageType = await this.prompt({
            name: 'decision',
            message: 'Would you like to select a custom Message type?',
            require: true,
            default: false,
            type: 'confirm',
        });

        this.args.defaultMessageImport = false;
        if (selectMessageType.decision) {
            // search all messages types.
            const messages = glob
                .sync(this.contextRoot + '/src/contracts/*-message.ts')
                .map(file => {
                    return {
                        label: `${_.upperFirst(_.camelCase(path.basename(file).replace('.ts','')))} (${chalk.italic(path.basename(file))})`,
                        class: _.upperFirst(_.camelCase(path.basename(file).replace('.ts',''))),
                        file: path.basename(file),
                    }
                });

                messages.push({
                    label: `TapjawMessage (${chalk.italic('default')})`,
                    class: 'TapjawMessage',
                    file: null,
                });

            const answer = await this.prompt({
                name: 'messageType',
                message: 'Plese select a message type:',
                choices: messages.map(message => ({
                    label: message.label,
                    value: message.class,
                })),
                type: 'list',
                require: true,
            });

            if (answer.messageType === 'TapjawMessage') {
                this.args.messageType = 'TapjawMessage';
                this.args.defaultMessageImport = true;
            } else {
                this.args.messageType = answer.messageType;
                this.args.messageImport = messages.filter(message => message.class === answer.messageType).pop().file.replace('.ts', '');
            }
        } else {
            this.args.messageImport = null;
            this.args.messageType = 'TapjawMessage';
            this.args.defaultMessageImport = true;
        }
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('adapter.ts'),
            this.destinationPath(`src/adapters/${this.args.adapterName}-adapter.ts`),
            {
                connectorclass: _.upperFirst(_.camelCase(path.basename(this.connector.connector).replace('.ts',''))),
                connectorpath: this.connector.connector.replace('.ts', ''),
                classname: _.upperFirst(_.camelCase(this.args.adapterName)),
                defaultimport: this.args.defaultMessageImport,
                messagetype: this.args.messageType,
                customimport: this.args.messageImport ? this.args.messageImport : null,
            }
        );
    }

    end() {
        this.log(`Adapter has been succesfully created at ${chalk.green.italic(`src/adapters/${this.args.adapterName}-adapter.ts`)}.`);
    }
};