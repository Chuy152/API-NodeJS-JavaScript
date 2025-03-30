const mongoose = require('mongoose');

const AutoSchema = new mongoose.Schema({
    Modelo: { type: String, required: true },
    FechaModelo: { type: String, required: true },
    Costo: { type: Number, required: true },
    Fabricante: { type: String, required: true },
    NumeroSerie: { type: String, required: true },
    Accesorios: [
        {
            IdAccesorio: { type: Number, required: true },
            Nombre: { type: String, required: true },
            Tipo: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('Autos', AutoSchema, 'Autos');

