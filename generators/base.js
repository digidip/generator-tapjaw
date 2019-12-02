var Generator = require('yeoman-generator');
const fs = require('fs');
const chalk = require('chalk');

module.exports = class extends Generator {
    _checkForDirectorySrc(error) {
        if (!fs.existsSync(`${this.contextRoot}/src/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/')}" directory.`);
            return true;
        }

        return error;
    }

    _checkForDirectoryCommands(error) {
        if (!fs.existsSync(`${this.contextRoot}/src/commands/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/commands/')}" directory.`);
            return true;
        }

        return error;
    }

    _checkForDirectoryConnectors(error) {
        if (!fs.existsSync(`${this.contextRoot}/src/connectors/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/connectors/')}" directory.`);
            return true;
        }

        return error;
    }


    _checkForDirectoryContracts(error) {
        if (!fs.existsSync(`${this.contextRoot}/src/contracts/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/contracts/')}" directory.`);
            return true;
        }

        return error;
    }

    _checkForDirectoryAdapter(error) {
        if (!fs.existsSync(`${this.contextRoot}/src/adapters/`)) {
            this.log.error(`Project does not contain "${chalk.red.bold(this.contextRoot + '/src/adapters/')}" directory.`);
            return true;
        }

        return error;
    }
}