const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');
const request = require('request-promise-native');

module.exports = class extends Generator {
    async projectName() {
        this.log('Creating a new Tapjaw Project');

        this.args = await this.prompt([
            {
                name: 'projectName',
                type: 'input',
                message: 'Enter the name of your new project (us hyphen case, e.g. "my-test")',
                require: true,
            },
            {
                name: 'author',
                type: 'input',
                message: 'Enter author name:',
                require: true,
            }
        ]);
        this.args.root = this.contextRoot + '/' + this.args.projectName;

        this.log(`Creating project tree at ${chalk.greenBright(this.args.root)}`);
    }

    async writing() {
        fs.mkdirSync(this.args.root);
        this.log(`   ${chalk.green('create')} ${this.args.root}`);

        fs.mkdirSync(this.destinationPath(this.args.projectName + '/src'));
        this.log(`   ${chalk.green('create')} ${this.args.projectName}/src`);

        fs.mkdirSync(this.destinationPath(this.args.projectName + '/src/contracts'));
        this.log(`   ${chalk.green('create')} ${this.args.projectName}/src/contracts`);
        this.fs.copy(
            this.templatePath('.gitkeep'),
            this.destinationPath(this.args.projectName + '/src/contracts/.gitkeep')
        );

        fs.mkdirSync(this.destinationPath(this.args.projectName + '/src/commands'));
        this.log(`   ${chalk.green('create')} ${this.args.projectName}/src/commands`);
        this.fs.copy(
            this.templatePath('.gitkeep'),
            this.destinationPath(this.args.projectName + '/src/commands/.gitkeep')
        );

        fs.mkdirSync(this.destinationPath(this.args.projectName + '/src/connectors'));
        this.log(`   ${chalk.green('create')} ${this.args.projectName}/src/connectors`);
        this.fs.copy(
            this.templatePath('.gitkeep'),
            this.destinationPath(this.args.projectName + '/src/connectors/.gitkeep')
        );

        fs.mkdirSync(this.destinationPath(this.args.projectName + '/src/configs'));
        this.log(`   ${chalk.green('create')} ${this.args.projectName}/src/configs`);
        this.fs.copy(
            this.templatePath('.gitkeep'),
            this.destinationPath(this.args.projectName + '/src/configs/.gitkeep')
        );

        fs.mkdirSync(this.destinationPath(this.args.projectName + '/src/adapters'));
        this.log(`   ${chalk.green('create')} ${this.args.projectName}/src/adapters`);
        this.fs.copy(
            this.templatePath('.gitkeep'),
            this.destinationPath(this.args.projectName + '/src/adapters/.gitkeep')
        );

        this.fs.copy(
            this.templatePath('.editorconfig'),
            this.destinationPath(this.args.projectName + '/.editorconfig')
        );

        this.fs.copy(
            this.templatePath('.env'),
            this.destinationPath(this.args.projectName + '/.env')
        );

        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath(this.args.projectName + '/package.json'),
            {
                name: this.args.projectName,
                description: `${this.args.projectName} description`,
                author: this.args.author,
            }
        )

        // download required files.
        const gitignore = await request.get('https://raw.githubusercontent.com/digidip/tapjaw-example/master/.gitignore');
        this.fs.write(
            this.destinationPath(this.args.projectName + '/.gitignore'),
            gitignore
        );

        const tsconfig = await request.get('https://raw.githubusercontent.com/digidip/tapjaw-example/master/tsconfig.json');
        this.fs.write(
            this.destinationPath(this.args.projectName + '/tsconfig.json'),
            tsconfig
        );

        const tslint = await request.get('https://raw.githubusercontent.com/digidip/tapjaw-example/master/tslint.json');
        this.fs.write(
            this.destinationPath(this.args.projectName + '/tslint.json'),
            tslint
        );


        const yarnLock = await request.get('https://raw.githubusercontent.com/digidip/tapjaw-example/master/yarn.lock');
        this.fs.write(
            this.destinationPath(this.args.projectName + '/yarn.lock'),
            yarnLock
        );
    }
};
