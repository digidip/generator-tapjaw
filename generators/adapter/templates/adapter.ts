import { TapjawAdapter, sortObjectArrays<% if (defaultimport) { %>, TapjawMessage<% } %> } from 'tapjaw-importer';
import <%- connectorclass %> from '../connectors/<%- connectorpath %>';
<% if (customimport) { %>import <%- messagetype %> from '../contracts/<%- customimport %>';
<% } %>
export default class <%- classname %>Adapter implements TapjawAdapter<<%- classname %>Adapter, <%- messagetype %>> {
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
     * method must return a AsyncGenerator<<%- messagetype %>> data type.
     *
     */
    // public async * getSomething(): AsyncGenerator<<%- messagetype %>> {
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
    //              * Yield a <%- messagetype %> type with the necassary information.
    //              *
    //              * sortObjectArrays() will sort any internal array properties to prevent signature corruption.
    //              */
    //             yield new <%- messagetype %>('a <%- messagetype %>', sortObjectArrays(payload));
    //         }
    //     } catch (err) {
    //         /**
    //          * Throw any connector errors down the line.
    //          */
    //         throw err;
    //     }
    // }
}
