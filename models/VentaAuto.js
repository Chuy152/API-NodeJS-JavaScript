const mongoose =require('mongoose');

const VentaAutoSchema = new mongoose.Schema ({
    Idauto :{type:String,require:true},
    IdUsuario :{type:Number,require:true},
    VentaAuto :{
        PrecioTotal:{type:Number,require:true},
        TipoPago : {type:String,require:true},
        SaldoPendiente: {type:Number,require:true},
        PagosAuto :{
            Fecha: {type:String,require:true},
            Monto: {type:Number,require:true},
            Metodo: {type:String,require:true}
        },
        Seguro:{
            Contratado:{type:Boolean,require:true},
            PagosSeguro :{
                Fecha: {type:String,require:true},
                Monto: {type:Number,require:true},
                Metodo: {type:String,require:true}
            }
        }
    }
}) 