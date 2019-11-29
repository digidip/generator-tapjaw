import { TapjawHttpConnector<%- securityImport %> } from 'tapjaw-importer';
import TapjawAuthenticationWrapper from 'tapjaw-importer/lib/contracts/tapjaw-authentication-wrapper';
import <%= classname %>Connector, { <%= classname %>Response } from '../contracts/<%= connectorname %>-connector';

/**
 * A basic HTTP connector implementation of the example-api.ts webserver.
 */
export default class <%= classname %>HttpConnector extends TapjawHttpConnector implements <%= classname %>Connector {
    /**
     * Disable gzip usage
     */
    enableGzip = false;

    /**
     * Disable any decoding of the API response.
     */
    useDecoding = undefined;

    /**
     * Disable any encoding on ExampleResponse.
     */
    useEncoding = undefined;

    constructor(security?: TapjawAuthenticationWrapper) {
        super('<%- hostname %>', <%= port %>, <%- protocol %>, security<%- securityMethod %>);
    }

    public async method(): Promise<<%= classname %>Response> {
        return new Promise(async (resolve, reject) => {
            const result = await this.get('/method', {}).catch(reject) as string;
            
            if (result) {
                resolve(JSON.parse(result) as <%= classname %>Response); // JSON decode raw response into an object of <%= classname %>Response.
            } else {
                reject('No results');
            }
        });
    }
}