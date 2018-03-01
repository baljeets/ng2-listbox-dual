/**
 * Helper interface for listbox items
 */
export interface IListBoxItem {
    value: string;
    text: string;
}
/**
 * Helper interface to emit event when
 * items are moved between boxes
 */
export interface IItemsMovedEvent {
    available: Array<{}>;
    selected: Array<{}>;
    movedItems: Array<{}>;
}
/**
 * Interface for dual list box icons
 */
export interface IDualListBoxActionIcon {
    moveAllToSelected: {
        directionIcon: string;
        listIcon: string;
    };
    moveAllToAvailable: {
        directionIcon: string;
        listIcon: string;
    };
    moveSingleToAvailable: string;
    moveSingleToSelected: string;
}