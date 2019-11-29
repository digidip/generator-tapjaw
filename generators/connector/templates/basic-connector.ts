import { TapjawConnector } from 'tapjaw-importer';
import <%= classname %>Connector, { <%= classname %>Response } from '../contracts/<%= connectorname %>-connector';

/**
 * A basic HTTP connector implementation of the example-api.ts webserver.
 */
export default class <%= classname %>CustomConnector implements TapjawConnector, <%= classname %>Connector {
    hasSecurity(): boolean {
        return false;
    }
}