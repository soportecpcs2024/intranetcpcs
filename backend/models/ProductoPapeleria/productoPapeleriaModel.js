// Importacion de mongoose
const mongoose = require('mongoose');

const productoPapeleriaSchema = new mongoose.Schema({
     nombre: { 
        type : String, 
        required: [true, "Por favor ingrese el nombre completo"],
        trim: true,     
    },

    descripcion: { 
        type : String, 
        required: [true, "Por favor ingrese la descripcion del producto"],
        trim: true,     
    },

    //  Las familias de las productos          

    categoria: { 
        type : String,
        required: [true, "Por favor ingrese la categoria del producto"],    
        enum:[
            "Hojas"
            ,"Cuadernos",
            "Carpetas",
            "Pliego"
           ],   
        trim: true,
    },

    unidad_de_medida: { 
        type : String,
        required: [true, "Por favor ingrese el tamaño del producto"], 
        enum:[
            "Carta", 
            "Oficio",
            "litro",
            "Unidad"
        ],      
        trim: true,
    },

    color: { 
        type : String,
        required: [true, "Por favor ingrese el color del producto"], 
        enum:[
            "Blanco", 
            "Azul", 
            "Rojo",
            "Verde",
            "Amarillo",
            "morado",
            "Naranja",
            "Rosa"
        ],
        trim: true,
    },

    stock_actual: { 
        type : Number,
        required: [true, "Por favor ingrese el stock del producto"],     
        trim: true,
    },

    stock_minimo: { 
        type : Number,
        required: [true, "Por favor ingrese el stock mínimo del producto"],     
        trim: true,
    },

    proveedor: { 
        type : String,
        required: [true, "Por favor ingrese el proveedor del producto"],     
        trim: true,
    },

    referencia_proveedor: { 
        type : String,
        required: [true, "Por favor ingrese la referencia del producto"],     
        trim: true,
    },

    fecha_de_ingreso: { 
        type : Date,
        required: [true],  
        default: Date.now  // opcional: asigna la fecha actual automáticamente
    },

    estado: { 
        type : String,
        required: [true, "Por favor ingrese el estado del producto"],  
        enum:[
            "Disponible", 
            "No disponible"
        ],   
        trim: true,
    }, 
},
{
    timestamps: true
});

// Exportacion del modelo
const ProductoPapeleria = mongoose.model('ProductoPapeleria', productoPapeleriaSchema);
module.exports = ProductoPapeleria;
