import { api, LightningElement } from 'lwc';
import { updateAccessory } from 'c/utils';

export default class AccessoriesLineItem extends LightningElement {
    @api
    isEditable;

    @api accessory;

    @api need;

    get buttonStyle() {
        if (this.need === 'MANDATORY') {
            return 'background-color: rgba(255,225,186,0.6);border: 1px solid rgba(255,203,138,0.6)';
        }
        return 'border:1px solid #E1E1E1;background-color: #EEEEEE';
    }
    deleteAttachment() {
        this.dispatchEvent(
            new CustomEvent(
                'delete_item',
                this.costructDeleteEvent(
                    this.accessory.accessoryAttachmentId,
                    this.accessory.accessoryId,
                    this.accessory.name,
                ),
            ),
        );
    }

    handleQuantityChange(e) {
        this.dispatchEvent(
            new CustomEvent(
                'update_quantity',
                this.constructEditEvent(
                    this.accessory.accessoryAttachmentId,
                    this.accessory.accessoryId,
                    this.accessory.name,
                    parseInt(e.target.value, 10),
                ),
            ),
        );
    }

    // async connectedCallback() {
    //     console.log('The set accessory is', JSON.stringify(this.accessory));
    //     const inserted = await updateAccessory(this.accessory);
    //     console.log('inserted', inserted);
    // }

    constructEditEvent(attachmentId, accessoryId, name, quantity) {
        let editEvent = {
            quantity: quantity,
        };
        if (attachmentId) editEvent.accessoryAttachmentId = attachmentId;
        if (accessoryId) editEvent.accessoryId = accessoryId;
        if (name) editEvent.name = name;
        return { detail: editEvent };
    }

    costructDeleteEvent(attachmentId, accessoryId, name) {
        let deleteEvent = {};
        if (attachmentId) deleteEvent.accessoryAttachmentId = attachmentId;
        else if (accessoryId) deleteEvent.accessoryId = accessoryId;
        else deleteEvent.name = name;
        return { detail: deleteEvent };
    }
}
