import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import * as _ from 'lodash';

import { DualListBoxComponent } from '../dual-list-box.component';
import { ArraySortPipe, ArrayFilterPipe } from '../array.pipes';
import { IListBoxItem } from '../models';

describe('DualListBoxComponent with TCB', (): void => {

    let fixture: ComponentFixture<DualListBoxComponent>;
    let testArray = [];
    for (let i = 1; i < 100; i++) {
        testArray.push({
            id: i.toString(),
            name: 'Name ' + i
        });
    }

    beforeEach((done: Function) => {
        TestBed.configureTestingModule({
            declarations: [
                DualListBoxComponent,
                ArraySortPipe,
                ArrayFilterPipe
            ],
            imports: [
                CommonModule,
                ReactiveFormsModule
            ]
        });

        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(DualListBoxComponent);
            done();
        });
    });

    it('should initialize available and selected items from passed data, valueField and textField', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = ['name'];
        component.data = testArray;

        fixture.detectChanges();

        expect(component.selectedItems).toEqual([]);
        expect(_.isEqualWith(testArray, component['availableItems'], (testItem, availableItem) => {
            return testItem.id === availableItem.value && testItem.name === availableItem.text;
        })).toBe(true);

        done();
    });

    it('should create options in available list box from passed data, valueField and textField', (done: Function): void => {

        const sortPipe: ArraySortPipe = new ArraySortPipe();
        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;

        fixture.detectChanges();

        const availableListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=availableListBox]'));
        const selectedListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=selectedListBox]'));
        expect(availableListBox).toBeTruthy();
        expect(_.isEqual(sortPipe.transform(testArray, ['name', 'ASC']), availableListBox.children.map((elem: DebugElement) => ({
            id: (elem.nativeElement as HTMLOptionElement).value.split(':')[1].trim().replace("'", '').replace("'", ''),
            name: (elem.nativeElement as HTMLOptionElement).text
        })))).toBe(true);
        expect(selectedListBox.children.length).toEqual(0);

        done();
    });

    it('should display default text above list boxes if none is passed', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;

        fixture.detectChanges();

        const boxTitles: string[] = fixture.debugElement.queryAll(By.css('h4.vertical-spacing-5'))
            .map((item: DebugElement) => (item.nativeElement as HTMLHeadingElement).innerHTML.toString());

        expect(boxTitles.length).toEqual(2);
        expect(_.isEqual(boxTitles, [component.availableText, component.selectedText])).toBe(true);

        done();
    });

    it('should hide move all buttons if moveAllButton is false', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.moveAllButton = false;
        component.data = testArray;

        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('.glyphicon.glyphicon-list')).length).toEqual(0);

        done();
    });

    // testing class methods

    it('should move all items from available to selected', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;

        fixture.detectChanges();

        expect(component.availableItems.length).toEqual(testArray.length);
        expect(component.selectedItems.length).toEqual(0);

        component.moveAllItemsToSelected();

        expect(component.availableItems.length).toEqual(0);
        expect(component.selectedItems.length).toEqual(testArray.length);
        expect(_.isEqualWith(testArray, component['selectedItems'], (testItem, selectedItem) => {
            return testItem.id === selectedItem.value && testItem.name === selectedItem.text;
        })).toBe(true);
        expect(component.availableListBoxControl.value).toEqual([]);

        done();
    });

    it('should move all options[DOM] from available list box to selected list box', (done: Function): void => {

        const sortPipe: ArraySortPipe = new ArraySortPipe();
        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;

        fixture.detectChanges();

        expect(component.availableItems.length).toEqual(testArray.length);
        expect(component.selectedItems.length).toEqual(0);

        component.moveAllItemsToSelected();

        fixture.detectChanges();

        const availableListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=availableListBox]'));
        const selectedListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=selectedListBox]'));
        expect(availableListBox).toBeTruthy();
        expect(selectedListBox).toBeTruthy();
        expect(_.isEqual(sortPipe.transform(testArray, ['name', 'ASC']), selectedListBox.children.map((elem: DebugElement) => ({
            id: (elem.nativeElement as HTMLOptionElement).value.split(':')[1].trim().replace("'", '').replace("'", ''),
            name: (elem.nativeElement as HTMLOptionElement).text
        })))).toBe(true);
        expect(availableListBox.children.length).toEqual(0);

        done();
    });

    it('should move all items from selected to available', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = [...testArray];

        fixture.detectChanges();

        component.moveAllItemsToSelected();

        expect(component.availableItems.length).toEqual(0);
        expect(component.selectedItems.length).toEqual(testArray.length);
        expect(_.isEqualWith(testArray, component.selectedItems, (testItem, selectedItem) => {
            return testItem.id === selectedItem.value && testItem.name === selectedItem.text;
        })).toBe(true);

        component.moveAllItemsToAvailable();

        expect(component.selectedItems.length).toEqual(0);
        expect(component.availableItems.length).toEqual(testArray.length);
        expect(_.isEqualWith(testArray, component.availableItems, (testItem, selectedItem) => {
            return testItem.id === selectedItem.value && testItem.name === selectedItem.text;
        })).toBe(true);
        expect(component.selectedListBoxControl.value).toEqual([]);

        done();
    });

    it('should move all options[DOM] from selected list box to available list box', (done: Function): void => {

        const sortPipe: ArraySortPipe = new ArraySortPipe();
        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;

        fixture.detectChanges();

        expect(component.availableItems.length).toEqual(testArray.length);
        expect(component.selectedItems.length).toEqual(0);

        component.moveAllItemsToSelected();

        fixture.detectChanges();

        const availableListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=availableListBox]'));
        const selectedListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=selectedListBox]'));
        expect(availableListBox).toBeTruthy();
        expect(selectedListBox).toBeTruthy();
        expect(_.isEqual(sortPipe.transform(testArray, ['name', 'ASC']), selectedListBox.children.map((elem: DebugElement) => ({
            id: (elem.nativeElement as HTMLOptionElement).value.split(':')[1].trim().replace("'", '').replace("'", ''),
            name: (elem.nativeElement as HTMLOptionElement).text
        })))).toBe(true);
        expect(availableListBox.children.length).toEqual(0);

        component.moveAllItemsToAvailable();

        fixture.detectChanges();

        expect(_.isEqual(sortPipe.transform(testArray, ['name', 'ASC']), availableListBox.children.map((elem: DebugElement) => ({
            id: (elem.nativeElement as HTMLOptionElement).value.split(':')[1].trim().replace("'", '').replace("'", ''),
            name: (elem.nativeElement as HTMLOptionElement).text
        })))).toBe(true);
        expect(selectedListBox.children.length).toEqual(0);

        done();
    });

    it('should move all marked items from available to selected, reset search term and emit event', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;
        spyOn(component.onItemsMoved, 'emit');
        spyOn(component.onAvailableItemSelected, 'emit');

        fixture.detectChanges();

        const availableListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=availableListBox]'));
        const selectedListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=selectedListBox]'));
        let availableOptions: HTMLOptionElement[] = availableListBox.children
            .map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);
        let selectedOptions: HTMLOptionElement[] = selectedListBox.children
            .map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);

        const movedItems: any = [];
        for (let i = 0; i < 3; i++) {

            movedItems.push(availableOptions[i].value.split(':')[1].trim().replace("'", '').replace("'", ''));
        }
        component.availableListBoxControl.setValue(movedItems);
        expect(component.onAvailableItemSelected.emit).toHaveBeenCalledWith(movedItems);

        fixture.detectChanges();

        component.moveMarkedAvailableItemsToSelected();

        fixture.detectChanges();

        availableOptions = availableListBox.children.map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);
        selectedOptions = selectedListBox.children.map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);

        expect(availableOptions.length).toEqual(testArray.length - 3);
        expect(selectedOptions.length).toEqual(3);
        expect(component['availableItems'].length).toEqual(testArray.length - 3);
        expect(component['selectedItems'].length).toEqual(3);

        expect(_.intersectionWith(availableOptions, movedItems, (option: HTMLOptionElement, item: { id: string, name: string }) => {
           return option.value.split(':')[1].trim().replace("'", '').replace("'", '') === item.id;
        }).length).toEqual(0);
        expect(_.intersectionWith(component.availableItems, component.selectedItems,
            (availableItem: IListBoxItem, selectedItem: IListBoxItem) => {
                return availableItem.value === selectedItem.value;
            }).length).toEqual(0);
        expect(component.availableListBoxControl.value).toEqual([]);
        expect(component.availableSearchInputControl.value).toEqual('');
        expect(component.onItemsMoved.emit).toHaveBeenCalledWith({
            available: component.availableItems,
            selected: component.selectedItems,
            movedItems: movedItems,
            from: 'available',
            to: 'selected'
        });

        done();
    });

    it('should move all marked items from selected to available, reset search term and emit event', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;
        spyOn(component.onItemsMoved, 'emit');
        spyOn(component.onSelectedItemsSelected, 'emit');

        fixture.detectChanges();

        const availableListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=availableListBox]'));
        const selectedListBox: DebugElement = fixture.debugElement.query(By.css('select[formControlName=selectedListBox]'));
        let availableOptions: HTMLOptionElement[] = availableListBox.children
            .map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);
        let selectedOptions: HTMLOptionElement[] = selectedListBox.children
            .map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);

        let movedItems: string[] = [];
        for (let i = 0; i < 3; i++) {

            movedItems.push(availableOptions[i].value.split(':')[1].trim().replace("'", '').replace("'", ''));
        }
        component.availableListBoxControl.setValue(movedItems);

        fixture.detectChanges();

        component.moveMarkedAvailableItemsToSelected();

        fixture.detectChanges();

        availableOptions = availableListBox.children.map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);
        selectedOptions = selectedListBox.children.map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);

        movedItems = [];
        for (let i = 0; i < 3; i++) {

            movedItems.push(selectedOptions[i].value.split(':')[1].trim().replace("'", '').replace("'", ''));
        }
        component.selectedListBoxControl.setValue(movedItems);
        expect(component.onSelectedItemsSelected.emit).toHaveBeenCalledWith(movedItems);

        fixture.detectChanges();

        component.moveMarkedSelectedItemsToAvailable();

        fixture.detectChanges();

        availableOptions = availableListBox.children.map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);
        selectedOptions = selectedListBox.children.map((elem: DebugElement) => elem.nativeElement as HTMLOptionElement);

        expect(availableOptions.length).toEqual(testArray.length);
        expect(selectedOptions.length).toEqual(0);
        expect(component.availableItems.length).toEqual(testArray.length);
        expect(component.selectedItems.length).toEqual(0);

        expect(_.intersectionWith(availableOptions, movedItems, (option: HTMLOptionElement, item: string) => {
            return option.value.split(':')[1].trim().replace("'", '').replace("'", '') === item;
        }).length).toEqual(3);
        expect(_.intersectionWith(component.availableItems, component.selectedItems,
            (availableItem: IListBoxItem, selectedItem: IListBoxItem) => {
            return availableItem.value === selectedItem.value;
        }).length).toEqual(0);
        expect(component.selectedListBoxControl.value).toEqual([]);
        expect(component.selectedSearchInputControl.value).toEqual('');
        expect(component.onItemsMoved.emit).toHaveBeenCalledWith({
            available: component.availableItems,
            selected: component.selectedItems,
            movedItems: movedItems,
            from: 'selected',
            to: 'available'
        });

        done();
    });

    it('should move one item from available to selected, reset search term and emit event', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;
        spyOn(component.onItemsMoved, 'emit');

        component.moveAvailableItemToSelected({ value: '1', text: 'Name 1' });

        expect(component.availableItems.length).toEqual(testArray.length - 1);
        expect(component.selectedItems.length).toEqual(1);
        expect(component.selectedItems[0].value).toEqual('1');
        expect(component.availableSearchInputControl.value).toEqual('');
        expect(component.onItemsMoved.emit).toHaveBeenCalledWith({
            available: component.availableItems,
            selected: component.selectedItems,
            movedItems: ['1'],
            from: 'available',
            to: 'selected'
        });

        fixture.detectChanges();
        done();
    });

    it('should move one item from selected to available, reset search term and emit event', (done: Function): void => {

        const component: DualListBoxComponent = fixture.componentInstance;
        component.valueField = 'id';
        component.textField = 'name';
        component.data = testArray;
        spyOn(component.onItemsMoved, 'emit');

        component.moveAvailableItemToSelected({ value: '1', text: 'Name 1' });
        component.moveSelectedItemToAvailable({ value: '1', text: 'Name 1' });

        expect(component.availableItems.length).toEqual(testArray.length );
        expect(component.selectedItems.length).toEqual(0);
        expect(component.selectedSearchInputControl.value).toEqual('');
        expect(component.onItemsMoved.emit).toHaveBeenCalledWith({
            available: component.availableItems,
            selected: component.selectedItems,
            movedItems: ['1'],
            from: 'selected',
            to: 'available'
        });

        fixture.detectChanges();
        done();
    });
});