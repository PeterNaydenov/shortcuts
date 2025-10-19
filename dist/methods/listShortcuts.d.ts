export default listShortcuts;
export type contextShortcuts = {
    /**
     * - Context name
     */
    context: string;
    /**
     * - List of shortcuts in a context
     */
    shortcuts: string[];
};
/**
 * @typedef {object} contextShortcuts
 * @property {string} context - Context name
 * @property {string[]} shortcuts - List of shortcuts in a context
 */
declare function listShortcuts(dependencies: any, state: any): (contextName?: string) => string[] | contextShortcuts[];
