const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('lodash');
const inquirer = require('inquirer');
const fs = require('fs');

module.exports = class extends Generator {
    initializing() {
        this.log(`Add new Tapjaw Connector in project: ${chalk.green(this.contextRoot)}`);

        let error = false;
        if (!fs.existsSync(`${this.contextRoot}/src/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/')}" directory.`);
            error = true;         
        }

        if (!fs.existsSync(`${this.contextRoot}/src/connectors/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/connectors/')}" directory.`);
            error = true;
        }

        if (!fs.existsSync(`${this.contextRoot}/src/contracts/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/contracts/')}" directory.`);
            error = true;
        }
        if (error) process.exit(1);
    }

    async defineConnector() {
        this.args = await this.prompt([
            {
                type: 'input',
                name: 'connectorName',
                message: 'Enter the name of your new connector (us hyphen case, e.g. "my-test")',
                require: true,
            },
            {
                type: 'list',
                choices: [
                    {
                        name: 'TapjawHttpConnector (class)',
                        value: 'TapjawHttpConnector'
                    },
                    {
                        name: 'TapjawConnector (interface)',
                        value: 'TapjawConnector',
                    },
                    new inquirer.Separator(),
                    {
                        name: 'TapjawSoapConnector',
                        disabled: 'Not implemented',
                    },
                    {
                        name: 'TapjawStreamConnector',
                        disabled: 'Not implemented',
                    },
                ],
                name: 'connectorType',
                message: 'Which base should your connector extends/implement?',
                require: true,
            }
        ]);

        // does file class exist?
        this.filename = this.contextRoot + '/src/connector/' + this.args.connectorName + '.ts';
        if (fs.existsSync(this.filename)) {
            this.log.error(`${chalk.red.italic(this.filename)} already exists. Terminating!`);
            process.exit(1);
        }
        
        // this.log(`Creating command: ${chalk.green.bold(this.filename)} - class name will be "${chalk.yellowBright.bold('class ' + _.chain(this.commandName.commandName).camelCase().upperFirst() + ' extends TapjawCommand { ... }')}".`);
    }

    async httpHostDetails() {
        if (this.args.connectorType === 'TapjawConnector') {
            return;
        }

        this.httpOptions = await this.prompt([
            {
                type: 'input',
                name: 'hostname',
                message: 'Enter the API/Service\'s hostname:',
                require: true,
            },
            {
                type: 'input',
                name: 'port',
                message: 'Enter the API/Service\'s port number:',
                default: '443'
            },
            {
                type: 'list',
                choices: [
                    {
                        name: 'Use HTTPS',
                        value: true
                    },
                    {
                        name: 'Use HTTP',
                        value: false
                    },
                ],
                name: 'protocol',
                message: 'Select API/Service\'s server protocol?',
                require: true,
            }
        ]);
    }

    async securityImplementation() {
        if (this.args.connectorType === 'TapjawConnector') {
            return;
        }

        this.args = { 
            ...(
                await this.prompt(
                {
                    type: 'confirm',
                    name: 'hasSecurity',
                    message: 'Will your new connector require an authenticator?',
                    require: true,
                    default: false
                })
            ),
            ...this.args,
        };

        if (this.args.hasSecurity) {
            // need to ask which types
            this.security = await this.prompt({
                type: 'list',
                name: 'authenticator',
                choices: [
                    {
                        name: 'HTTP Basic Authentication',
                        value: 'BasicAuthAuthenticator',
                        default: true,
                    },
                    {
                        name: 'HTTP Bearer Authentication',
                        value: 'BearerAuthAuthenticator',
                    },
                    {
                        name: 'OAuth2 Authentication',
                        value: 'OauthAuthAuthenticator',
                    },
                ]
            });

            switch (this.security.authenticator) {
                case "BasicAuthAuthenticator":
                    await this._basicCredentials(); break;
                case "BearerAuthAuthenticator":
                    await this._bearerCredentials(); break;
                case "OauthAuthAuthenticator":
                    await this._oauthCredentials(); break;
            }
        }
    }

    async _basicCredentials() {
        this.credentials = await this.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Please enter a username?',
                require: true,
            },
            {
                type: 'input',
                name: 'password',
                message: 'Please enter a password?',
                require: true,
            },
        ]);
        this.credentials.import = 'createBasicSecurity';
        this.credentials.snippet = `createBasicSecurity('${this.credentials.username}', '${this.credentials.password}')`;
    }

    async _bearerCredentials() {
        this.credentials = await this.prompt([
            {
                type: 'input',
                name: 'token',
                message: 'Please enter the bearer token?',
                require: true,
            },
        ]);
        this.credentials.import = 'createBearerSecurity';
        this.credentials.snippet = `createBearerSecurity('${this.credentials.token}')`;
    }

    async _oauthCredentials() {
        this.credentials = await this.prompt([
            {
                type: 'input',
                name: 'clientId',
                message: 'Enter client ID',
                require: true,
            },
            {
                type: 'input',
                name: 'clientSecret',
                message: 'Enter client secret',
                require: true,
            },
            {
                type: 'input',
                name: 'hostname',
                message: 'Enter hostname of the OAuth endpoint?',
                require: true,
            },
            {
                type: 'input',
                name: 'path',
                message: 'Enter the URI (path) of the OAuth endpoint?',
                require: true,
            },
            // set this up as a recurive question in future.
            // {
            //     type: 'input',
            //     name: 'postParams',
            //     message: 'Please enter a password?',
            //     require: true,
            // },
            {
                type: 'list',
                name: 'method',
                choices: [
                    'POST',
                    'GET'
                ],
                message: 'Select a HTTP Method?',
                default: 'POST',
            },
            {
                type: 'input',
                name: 'encoding',
                message: 'Enter the character encoding of the response?',
                default: 'utf8',
            },
        ]);
        this.credentials.import = 'createOAuthSecurity';
        this.credentials.snippet = `createOAuthSecurity(
'${this.credentials.clientId}',
'${this.credentials.clientSecret}',
'${this.credentials.hostname}',
'${this.credentials.path}',
[],
'${this.credentials.method}',
'${this.credentials.encoding}'
)`;
    }

    writing() {
        console.log(
            this.credentials,
            this.security,
            this.args
        )
        this.fs.copyTpl(
            this.templatePath('contract-connector.ts'),
            this.destinationPath(`src/contracts/${this.args.connectorName}-connector.ts`),
            {
                classname: _.chain(this.args.connectorName).camelCase().upperFirst()
            }
        );

        if (this.args.connectorType === 'TapjawHttpConnector') {
            
            this.fs.copyTpl(
                this.templatePath('http-connector.ts'),
                this.destinationPath(`src/connectors/${this.args.connectorName}-http-connector.ts`),
                {
                    classname: _.chain(this.args.connectorName).camelCase().upperFirst(),
                    connectorname: this.args.connectorName,
                    securityMethod: this.args.hasSecurity ? ` || ${this.credentials.snippet}` : '',
                    securityImport: this.args.hasSecurity ? `, ${this.credentials.import}` : '',
                    ...this.httpOptions,
                }
            );
        } else {
            this.fs.copyTpl(
                this.templatePath('basic-connector.ts'),
                this.destinationPath(`src/connectors/${this.args.connectorName}-custom-connector.ts`),
                {
                    classname: _.chain(this.args.connectorName).camelCase().upperFirst(),
                    connectorname: this.args.connectorName,
                }
            );
        }
    }

    end() {
        this.log(`Connector has been succesfully created at ${chalk.green.italic(this.filename)}.`);
    }
};
