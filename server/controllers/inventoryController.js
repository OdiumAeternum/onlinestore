const { Inventory, InventoryDevice } = require("../models/models.js");
const ApiError = require('../error/ApiError');

class InventoryController {
    async add(req, resp, next) {
        try {
            const { deviceId } = req.body;

            if (!deviceId) {
                next(ApiError.badRequest());
            }

            const userId = req.user.id;

            if (!deviceId) {
                return next(ApiError.badRequest());
            }
            let inventory = await Inventory.findOne({where: { userId }});
            let inventoryId = inventory.id;

            let inventoryItem = await InventoryDevice.findOne({where: { deviceId, inventoryId }});

            if (inventoryItem) {
                return next(ApiError.forbidden('This product is already in the inventory.'));
            }

            inventoryItem = await InventoryDevice.create({ deviceId, inventoryId });

            return resp.json(inventoryItem);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAll(req, resp, next) {
        try {
            let { limit, page } = req.query;

            const userId = req.user.id;

            page = page || 1;
            limit = limit || 10;

            let offset = page * limit - limit;

            let inventory = await Inventory.findOne({where: { userId }});

            inventory = await InventoryDevice.findAndCountAll({where: { inventoryId: inventory.id }, limit, offset});

            return resp.json(inventory);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteOne(req, resp, next) {
        try {
            let { id } = req.params;
            await InventoryDevice.destroy({where: { id }});
            return resp.json({message: "deleted"});
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

module.exports = new InventoryController();