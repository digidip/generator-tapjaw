import { TapjawConnectorResponse } from 'tapjaw-importer/lib/contracts/tapjaw-connector';

/**
 * The specification of the <%= classname %> Response.
 */
export interface <%= classname %>Response extends TapjawConnectorResponse {
}

export default interface <%= classname %>Connector {
    // method(): Promise<<%= classname %>Response>;
}