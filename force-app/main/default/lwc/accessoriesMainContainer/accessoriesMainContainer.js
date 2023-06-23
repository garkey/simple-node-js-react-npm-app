import { LightningElement, api } from 'lwc';
import cams_mandatory_accessory from '@salesforce/label/c.cams_mandatory_accessory';
import cams_optional_accessory from '@salesforce/label/c.cams_optional_accessory';
export default class AccessoriesMainContainer extends LightningElement {
    label = {
        cams_mandatory_accessory,
        cams_optional_accessory,
    };
    @api
    isEditable;

    _initialUserData = [];

    @api
    get userSelectedData() {
        return [];
    }

    set userSelectedData(data) {
        this._initialUserData = data.map((elem) => {
            return {
                accessoryAttachmentId: elem.id,
                accessoryId: elem.accessory.id,
                name: elem.accessory.name,
                quantity: elem.quantity,
                need: elem.need,
            };
        });
        console.log('User selected data: ', JSON.stringify(data));
    }

    get requiredAccData() {
        return this._initialUserData.filter((e) => e.need === 'MANDATORY');
    }

    get optionalAccData() {
        return this._initialUserData.filter((e) => e.need === 'OPTIONAL');
    }

    @api
    generateAccessoryEditRequest() {
        let optionlAcc = JSON.parse(
            JSON.stringify(
                this.template.querySelector(
                    'c-accessories-type-container[data-id="optional"]',
                ).final_accessories_list,
            ),
        );
        let mandatoryAcc = JSON.parse(
            JSON.stringify(
                this.template.querySelector(
                    'c-accessories-type-container[data-id="mandatory"]',
                ).final_accessories_list,
            ),
        );

        mandatoryAcc = mandatoryAcc.map((elem) => {
            return { ...elem, need: 'MANDATORY' };
        });

        optionlAcc = optionlAcc.map((elem) => {
            return { ...elem, need: 'OPTIONAL' };
        });

        const editedAccessories = [...mandatoryAcc, ...optionlAcc];
        console.log(
            'Final edit accessories',
            JSON.stringify(editedAccessories),
        );
        console.log(
            'Initial accessories',
            JSON.stringify(this._initialUserData),
        );

        let addedAccessories = editedAccessories
            .filter((elem) => !elem.accessoryAttachmentId)
            .map((e) => {
                let acc = {};
                if (e.accessoryId) acc.id = e.accessoryId;
                else acc.name = e.name;

                return {
                    need: e.need,
                    quantity: e.quantity,
                    accessory: acc,
                };
            });

        let removedAttachmentIds = this._initialUserData
            .filter((elem) => {
                return !editedAccessories.find((e) => {
                    return (
                        elem.accessoryAttachmentId === e.accessoryAttachmentId
                    );
                });
            })
            .map((item) => item.accessoryAttachmentId);

        let alreadyAttached = editedAccessories.filter(
            (elem) => elem.accessoryAttachmentId,
        );

        let updatedAccessories = alreadyAttached
            .filter((elem) => {
                return (
                    elem.quantity !=
                    this._initialUserData.find(
                        (e) =>
                            e.accessoryAttachmentId ===
                            elem.accessoryAttachmentId,
                    ).quantity
                );
            })
            .map((item) => {
                return {
                    id: item.accessoryAttachmentId,
                    need: item.need,
                    quantity: item.quantity,
                };
            });

        // construct asset edit request

        let accessoryEditRequest = {};
        accessoryEditRequest.removedAccessoryAttachmentIds =
            removedAttachmentIds;
        accessoryEditRequest.addedOrEditedAccessoryAttachments = [
            ...addedAccessories,
            ...updatedAccessories,
        ];

        /**
         * {
    "addedOrEditedAccessoryAttachments": [
        {
            "accessory": {
                "name": "my custom accessory 2"
            },
            "need": "OPTIONAL",
            "quantity": 2
        },
        {
            "id": 6002802,
            "need": "MANDATORY",
            "quantity": 5
        }
    ],
    "removedAccessoryAttachmentIds": [
        6003502
    ]
}
         */
        ``;
        console.log('Added Accessories: ', JSON.stringify(addedAccessories));
        console.log(
            'Removed AttachmentIds: ',
            JSON.stringify(removedAttachmentIds),
        );
        console.log(
            'Updated accessories: ',
            JSON.stringify(updatedAccessories),
        );
        console.log(
            'Accessory Edit request: ',
            JSON.stringify(accessoryEditRequest),
        );
        return accessoryEditRequest;
    }
}
