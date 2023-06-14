import { LightningElement, api, track } from 'lwc';
import { loadFromCams } from 'c/utils';
import cams_add_accessory from '@salesforce/label/c.cams_add_accessory';
import addIcon from '@salesforce/resourceUrl/addAccessory';

export default class AccessoriesTypeContainer extends LightningElement {
    @api heading;

    @track
    accessoriesSearchData = [];

    @track
    searchResultCount = 0;

    @api need;

    @api
    isEditable;

    @track
    userselecteddata = [];

    label = {
        cams_add_accessory,
    };

    addIcon = addIcon + '#edit-asset-accessories-multiple-displayed';

    connectedCallback() {
        this.searchAccessories().then((d) =>
            console.log('test: default list accessories w/ no parameters', d),
        );
    }

    @api
    get initialuserdata() {
        return [];
    }
    set initialuserdata(data) {
        data.forEach((elem) => this.userselecteddata.push(elem));
    }

    @api
    get final_accessories_list() {
        console.log('inside final_accessories_list');
        console.log('this.userselecteddata;', this.userselecteddata);
        return this.userselecteddata;
    }

    placeholder = 'Add Accessory';
    value = '';

    get computeaccessory() {
        if (this.need === 'MANDATORY') {
            return 'background-color: #FFE6C6;border: 1px solid #ECC99C;';
        }
        return 'background-color: #EEEEEE;';
    }

    get showSearchResult() {
        return this.accessoriesSearchData.length > 0;
    }

    get showSearchResultCount() {
        return this.searchResultCount > 0;
    }

    get displayEmptyPlaceholder() {
        return this.accessoriesSearchData.length === 0 && this.value.length > 2;
    }

    handleinputclick(e) {
        this.value = e.target.value;
        this.clearSearchData();
        if (this.value.length > 2) {
            this.searchAccessories(this.value).then((result) => {
                this.searchResultCount = result.count;
                result.items.map((elem) =>
                    this.accessoriesSearchData.push({
                        accessoryId: elem.id,
                        accessoryName: elem.name,
                    }),
                );
            });
        }
        document.addEventListener('click', this.handleBlur.bind(this));
    }

    clearSearchData() {
        this.accessoriesSearchData.splice(0, this.accessoriesSearchData.length);
    }

    handleBlur() {
        document.removeEventListener('click', this.handleBlur.bind(this));
        this.clearSearchData();
        this.clearInput();
    }

    addExistingAccessory(e) {
        const selctedAccessoryId = parseInt(e.target.value, 10);

        this.createItem({
            detail: {
                accessoryId: selctedAccessoryId,
                name: this.accessoriesSearchData.find(
                    (elem) => elem.accessoryId === selctedAccessoryId,
                ).accessoryName,
                quantity: 1,
            },
        });
        this.clearInput();
    }

    addCustomAccessory() {
        this.createItem({
            detail: {
                name: this.value,
                quantity: 1,
            },
        });
        this.clearInput();
    }

    clearInput() {
        this.value = '';
    }

    deleteItem(deleteEvent) {
        this.userselecteddata = this.userselecteddata.filter(
            (elem) =>
                !(
                    (elem.accessoryAttachmentId &&
                        elem.accessoryAttachmentId ===
                            deleteEvent.detail.accessoryAttachmentId) ||
                    (elem.accessoryId &&
                        elem.accessoryId === deleteEvent.detail.accessoryId) ||
                    (elem.name && elem.name === deleteEvent.detail.name)
                ),
        );
    }

    createItem(createEvent) {
        let detail = createEvent.detail;
        if (detail.accessoryId) {
            let existingItem = this.userselecteddata.find(
                (elem) =>
                    elem.accessoryId && elem.accessoryId === detail.accessoryId,
            );
            if (!existingItem) {
                this.userselecteddata.push({
                    accessoryId: detail.accessoryId,
                    name: detail.name,
                    quantity: detail.quantity,
                });
            }
        } else if (detail.name) {
            let existingItem = this.userselecteddata.find(
                (elem) => elem.name && elem.name === detail.name,
            );
            if (!existingItem) {
                this.userselecteddata.push({
                    name: detail.name,
                    quantity: detail.quantity,
                });
            }
        }
    }

    updateQuantity(updateQuantityEvent) {
        let detail = updateQuantityEvent.detail;
        this.userselecteddata = this.userselecteddata.map((elem) => {
            console.log(
                'Accessory AttachmentId from elem and detail are: ',
                elem.accessoryAttachmentId,
                detail.accessoryAttachmentId,
            );
            if (
                (elem.accessoryAttachmentId &&
                    elem.accessoryAttachmentId ===
                        detail.accessoryAttachmentId) ||
                (elem.accessoryId && elem.accessoryId === detail.accessoryId) ||
                (elem.name && elem.name === detail.name)
            ) {
                elem.quantity = detail.quantity;
            }
            return elem;
        });
    }

    searchAccessories = async (query, { size } = { size: 50 }) => {
        const api1 = 'accessories';
        const p = new URLSearchParams({
            ...(query && { 'name.contains': query }),
            size,
        });
        const r = `${api1}?${p.toString()}`;
        console.log('r', r);
        const items = await loadFromCams(r);
        const c = `${api1}/count?${p.toString()}`;
        console.log('c', c);
        const count = (await loadFromCams(c)) - items?.length || 0;
        console.log('items', items);
        console.log('count', count);
        return { count, items };
    };
}
