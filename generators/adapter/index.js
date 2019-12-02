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

        this.connector = await this.prompt({
            type: 'list',
            name: 'connector',
            message: 'Please select the connector you wish to configure the adpater with:',
            choices: connectors.map(connector => ({
                name: connector.label,
                value: connector.file,
            })),
        });

        if (!this.connector.connector) {
            this.connector.connector = `${this.args.adapterName}-connector.ts`;
        }
    }

    writing() {
        console.log(this.connector);
        this.fs.copyTpl(
            this.templatePath('adapter.ts'),
            this.destinationPath(`src/adapters/${this.args.adapterName}-adapter.ts`),
            {
                connectorclass: _.upperFirst(_.camelCase(path.basename(this.connector.connector).replace('.ts',''))),
                connectorpath: this.connector.connector.replace('.ts', ''),
                classname: _.upperFirst(_.camelCase(this.args.adapterName)),
            }
        );
    }

    end() {
        this.log(`Adapter has been succesfully created at ${chalk.green.italic(`src/adapters/${this.args.adapterName}-adapter.ts`)}.`);
    }
};