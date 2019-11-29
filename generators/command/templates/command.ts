import { TapjawCommand } from 'tapjaw-importer';
import { TapjawCommandArgs, TapjawCommandFlags } from 'tapjaw-importer/lib/contracts/tapjaw-command';
import { TapjawAdapterCallback } from 'tapjaw-importer/lib/contracts/tapjaw-adapter';

export default class <%= classname %> extends TapjawCommand {
    /**
     * Description of the command
     */
    static description = '<%= classname %> Command';

    /**
     * Examples of the usage
     */
    static examples = [
        `$ bin/run <%= commandname %>
`,
    ];

    /**
     * The --flags available in this command, you must always implement:
     * `...TapjawCommand.defaultFlags` to get the default flags.
     */
    static flags = {
        ...TapjawCommand.defaultFlags,
    };

    /**
     * The arguments used by this command
     */
    static args = [];

    /**
     * Provide the current class to instance so OCLIF can determine which arguments and flags exist
     * against the hello command.
     */
    instance = <%= classname %>;

    /**
     * Provide your Adapter implementation which is to be used with this command.
     */
    // protected adapter = new <%= classname %>Adapter(new <%= classname %>HttpConnector());

    /**
     * It's essential that this method returns a `async function *(): AsyncGenerator<TapjawMessage> {}` lambda function
     * which wraps the Adapter.method() call and must pipe the yield to the Iterator.
     *
     * @param args TapjawCommandArgs
     * @param flags TapjawCommandFlags
     * @yields AnimalMessage
     */
    protected getAdapterCallback(args: TapjawCommandArgs, flags: TapjawCommandFlags): TapjawAdapterCallback {
        const adapter = this.adapter;

        // const { customFlag } = flags;
        // if (customFlag) {
        //     // Call the Adapter method using POST.
        //     return async function* (): AsyncGenerator<AnimalMessage> {
        //         /**
        //          * Pipe generator yield to Iterator
        //          */
        //         yield* adapter.iterate();
        //     };
        // }

        // Call the Adapter method using GET.
        return async function* (): AsyncGenerator<<%= classname %>Message> {
            /**
             * Pipe generator yield to Iterator
             */
            yield* adapter.iterate();
        };
    }
}