const mongoose = require('mongoose')

const oevelseSchema = new mongoose.Schema({
    oevelseNavn: {
        type: String,
        required: true
    },
    oevelseBeskrivelse: {
        type: String,
        required: true
    }
}, 
{ timestamps: true})

module.exports = mongoose.model('Oevelse', oevelseSchema, 'Oevelser')