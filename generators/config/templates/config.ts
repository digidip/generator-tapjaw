import { DotEnvConfig } from 'tapjaw-importer';

class <%- classname %>Config extends DotEnvConfig {
    constructor() {
        super('<%- name %> Config', '<%- namespace %>_');
    }
}

export default new <%- classname %>Config();
