import mongoose from "mongoose";
import CustomError from "../utils/error.js";


export async function services(collecion) {

    const chatSchema = new mongoose.Schema({
        chat: {
            type: Array,
            required: true,
        },
        estado: {
            type: String,
            required: true,
            lowercase: true,
        },
    });
    const Chat = mongoose.models[collecion] || mongoose.model(collecion, chatSchema, collecion);
    try {
        const res = await Chat.create({ chat: [], estado: " " });// Crea un documento en la colección
        const { _id } = res.toObject()
        //console.log(existe, Chat.modelName) // Devuelve el documento encontrado y el nombre del modelo
        return [true, _id,null]; // Devuelve el documento encontrado y el id del documento
    } catch (error) {
        console.log("Hubo un error en la creacion del documento en la base de datos")
        const e = new CustomError(`Error en la creación del documento. ${error.message}`, { collecion });
        return [false, null,e.res];
    }
}
