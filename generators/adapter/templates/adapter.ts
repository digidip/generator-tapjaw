import { TapjawAdapter, TapjawMessage, sortObjectArrays } from 'tapjaw-importer';
import <%- connectorclass %> from '../connectors/<%- connectorpath %>';


export default class <%- classname %>Adapter implements TapjawAdapter<<%- classname %>Adapter, TapjawMessage> {
    /**
     * Provide the connector implementation the Adapter should use.
     *
     * @param connector <%- connectorclass %>
     */
    constructor(private readonly connector: <%- connectorclass %>) {}

    /**
     * Example of a Adapter method implementation.
     *
     * The important part of the implemenation is that every Adapter
     * method must return a AsyncGenerator<TapjawMessage> data type.
     *
     */
    // public async * getSomething(): AsyncGenerator<TapjawMessage> {
    //     try {
    //         /**
    //          * Request the data from the connector, which should contain a
    //          * response in accordance with the ExampleResponse interface.
    //          */
    //         const apiResponse = await this.connector.something();

    //         /**
    //          * Iterate each data entity and yield to the TapjawIterator.
    //          */
    //         for (const payload of apiResponse.data) {
    //             /**
    //              * Yield a TapjawMessage type with the necassary information.
    //              *
    //              * sortObjectArrays() will sort any internal array properties to prevent signature corruption.
    //              */
    //             yield new TapjawMessage('a message', sortObjectArrays(payload));
    //         }
    //     } catch (err) {
    //         /**
    //          * Throw any connector errors down the line.
    //          */
    //         throw err;
    //     }
    // }
}
