import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

const existFile = async (path) => {
    try{
        await fs.promises.access(path);
        return true;
    }catch (error){
        return false;
    }
};

export const getJSON = async(path) => {
    if(!await existFile(path))
        return [];

    let content;
    try{
        content = await fs.promises.readFile(path, 'utf-8');
    }catch (error){
        throw new Error(`El archivo ${path} no se pudo leer.`);
    }

    try{
        return JSON.parse(content);
    }catch (error){
        throw new Error(`El archivo ${path} no tiene formato valido.`);
    }
};

export const saveJSON = async(path, data) =>{
    const content = JSON.stringify(data, null, '\t');
    try{
        await fs.promises.writeFile(path, content, 'utf-8');
    }catch (error){
        throw new Error('El archivo no se pudo escribir');
    }
};