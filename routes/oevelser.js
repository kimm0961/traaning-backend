const express = require('express')
const router = express.Router()
const Oevelse = require('../models/oevelse')

// Tester
router.get('/tester', (req, res) => {
    res.send('Tester')
})

// Getting all
router.get('/', async (req, res) => {
    try {
        const oevelser = await Oevelse.find()
        res.json(oevelser)
    } catch (err) {
        res.status(500).json({ message: err.message })
        
    }
   
})

// Getting One
router.get('/:id', getOevelse, (req, res) => {
    res.json(res.oevelse)
})

// Getting alle dine oevelser
router.get('/admin/dine-oevelser', async (req, res) => {

    try {
        const oevelser = await Oevelse.find({forfatter: req.session.userName})
        res.json(oevelser)
    } catch (err) {
        res.status(500).json({ message: err.message })
        
    }
})

// Creating one
router.post('/admin/', async (req, res) => {
    const oevelse = new Oevelse({
        oevelseNavn: req.body.oevelseNavn,
        oevelseBeskrivelse: req.body.oevelseBeskrivelse,
        forfatter: req.session.userName
    })

    try {
        const newOevelse = await oevelse.save()
        res.status(201).json(newOevelse)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch('/admin/:id', getOevelse, async (req, res) => {
    if (req.body.oevelseNavn != null) {
        res.oevelse.oevelseNavn = req.body.oevelseNavn
    }

    if (req.body.oevelseBeskrivelse != null) {
        res.oevelse.oevelseBeskrivelse = req.body.oevelseBeskrivelse
    }

    try {
        const updatedOevelse = await res.oevelse.save()
        res.json(updatedOevelse)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one
router.delete('/admin/:id', getOevelse, async (req, res) => {
    try {
        await res.oevelse.remove()
        res.json({message: 'Deleted Oevelse'})
    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
})

async function getOevelse(req, res, next) {
    let oevelse
    try {
        oevelse = await Oevelse.findById(req.params.id)
        if (oevelse == null) {
            return res.status(404).json({ message: 'Cannot find Oevelse'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.oevelse = oevelse
    next()
}

module.exports = router