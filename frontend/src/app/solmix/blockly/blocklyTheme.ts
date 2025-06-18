// Ref. https://developers.google.com/blockly/guides/configure/web/appearance/themes
import * as Blockly from "blockly";

/**
 * Dark theme.
 */
export default Blockly.Theme.defineTheme('dark', {
    base: Blockly.Themes.Classic,
    componentStyles: {
        workspaceBackgroundColour: '#1e1e1e',
        toolboxBackgroundColour: 'blackBackground',
        toolboxForegroundColour: 'black',
        flyoutBackgroundColour: '#252526',
        flyoutForegroundColour: '#ccc',
        flyoutOpacity: 1,
        scrollbarColour: '#797979',
        insertionMarkerColour: '#fff',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#d0d0d0',

    },
    fontStyle: {
            family: 'Arial, sans-serif',
            weight: 'normal',
            size: 14,
        },
    name: "dark"
});