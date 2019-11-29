var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    method1() {
        this.log('Tapjaw Project Generator');
        this.log('$ yo tapjaw:adapter\t\tCreate a new adapter');
        this.log('$ yo tapjaw:command\t\tCreate a new command');
        this.log('$ yo tapjaw:connector\t\tCreate a new connector');
        this.log('$ yo tapjaw:message\t\tCreate a new message');
        this.log('$ yo tapjaw:new-project\t\tCreate a new project tree');
    }
};
