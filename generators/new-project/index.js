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
        this.fs.copy(
            this.templatePath('src/**/.*'),
            this.destinationPath(this.args.projectName + '/src'),
        );
        this.fs.copy(
            this.templatePath('bin/*'),
            this.destinationPath(this.args.projectName + '/bin')
        );

        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
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
