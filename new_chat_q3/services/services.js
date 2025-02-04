import mongoose from "mongoose";
import CustomError from "../utils/error.js";


export async function services(id_chat, collecion) {

    const chatSchema = new mongoose.Schema({
        _id: {
            type: mongoose.Schema.Types.ObjectId, // O String si estás usando un ID personalizado
            required: true
        },
        genero: { type: Array, default: [], lowercase: true },
        titulos: { type: Array, default: [], lowercase: true },
        autores: { type: Array, default: [], lowercase: true },
        tema_pricipal: { type: Array, default: [], lowercase: true },
        ambientacion: { type: Array, default: [], lowercase: true },
        contexto_emocional: { type: Array, default: [], lowercase: true },
        hojas: { type: Number, default: 0 },
        nivel1: { type: String, default: "", lowercase: true },
        nivel2: { type: String, default: "", lowercase: true },
        nivel3: { type: String, default: "", lowercase: true }


    });
    const Chat = mongoose.models[collecion] || mongoose.model(collecion, chatSchema, collecion);
    try {
        console.log(`${id_chat}, Este es el id_chat`)
        const res = await Chat.create({ _id: id_chat});// Crea un documento en la colección
        const { _id } = res.toObject()
        //console.log(existe, Chat.modelName) // Devuelve el documento encontrado y el nombre del modelo
        return [true, _id, null]; // Devuelve el documento encontrado y el id del documento
    } catch (error) {
        console.log("Hubo un error en la creacion del documento en la base de datos")
        const e = new CustomError(`Error en la creación del documento. ${error.message}`, { collecion, id_chat });
        return [false, null, e.res];
    }
}
