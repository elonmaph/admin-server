var mongoose = require('mongoose');
const crypto = require('crypto');
const shortid = require('shortid');

var roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        menus: {
            type: Array,
            default: []
        }
    }
);

module.exports = roleSchema;
