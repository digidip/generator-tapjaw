const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');
const request = require('request-promise-native');

module.exports = class extends Generator {
    async projectName() {
        this.log('Creating a new Tapjaw Project');

        this.args = await this.prompt({
            name: 'projectName',
            type: 'input',
            message: 'Enter the name of your new project (us hyphen case, e.g. "my-test")',
            require: true,
        });
        this.args.root = this.contextRoot + '/' + this.args.projectName;

        this.log(`Creating project tree at ${chalk.greenBright(this.args.root)}`);
    }

    async writing() {
        fs.mkdirSync(this.args.root);
        this.fs.copy(
            this.templatePath('src/**/.*'),
            this.destinationPath(this.args.projectName + '/src')
        );
        this.fs.copy(
            this.templatePath('bin/*'),
            this.destinationPath(this.args.projectName + '/bin')
        );

        // download required files.
        const gitignore = await request.get('https://raw.githubusercontent.com/digidip/tapjaw-example/master/.gitignore');
        this.fs.write(
            this.destinationPath(this.args.projectName + '/.gitignore'),
            gitignore
        );

        const packageJson = await request.get('https://raw.githubusercontent.com/digidip/tapjaw-example/master/package.json');
        this.fs.write(
            this.destinationPath(this.args.projectName + '/package.json'),
            packageJson
                .replace('"name": "example",', `"name": "${this.args.projectName}",`)
                .replace('"description": "Example of the Tapjaw implementation",', `"description": "${this.args.projectName} description",`)
                .replace('"homepage": "https://github.com/digidip/example",\n', '')
                .replace('"repository": "digidip/example",\n', '')
                .replace('"bugs": "https://github.com/digidip/example/issues",\n', '')
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
