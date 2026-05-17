// 1. Importamos la función withCors
import { withCors } from '../common/cors';
import * as crypto from 'crypto';
import { dynamo } from '../lib/dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { badRequest, forbidden, created, internalError } from '../lib/response';

// 2. Quitamos el export y renombramos la función
const createProductHandler = async (event: any) => {
    try {
        const callerRole = event.requestContext?.authorizer?.role;
        const sellerId = event.requestContext?.authorizer?.userId;

        if (callerRole !== 'seller') {
            return forbidden('Solo los vendedores pueden crear productos');
        }

        const body = event.body ? JSON.parse(event.body) : {};
        const { name, description, price, stock } = body;

        if (!name || !description || price === undefined || stock === undefined) {
            return badRequest('Faltan datos requeridos');
        }
        if (price <= 0 || stock < 0 || !Number.isInteger(stock)) {
            return badRequest('Precio y stock deben ser números válidos');
        }

        const newProduct = {
            productId: crypto.randomUUID(),
            sellerId: sellerId,
            name,
            description,
            price,
            stock,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await dynamo.send(new PutCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Item: newProduct
        }));

        return created({ message: "Producto creado", product: newProduct });
    } catch (error: any) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ 
                message: "Error detectado en AWS", 
                detalle: error.message ? error.message : "El error no tiene mensaje",
                pista: String(error)
            }) 
        };
    }
};

// 3. Exportamos la función envuelta con CORS
export const createProduct = withCors(createProductHandler);