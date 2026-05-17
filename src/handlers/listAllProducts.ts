import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../lib/response';

// 1. Quitamos el "export" directo de aquí
const listAllProductsHandler = async (event: any) => {
    try {
        const result = await dynamo.send(new ScanCommand({
            TableName: process.env.PRODUCTS_TABLE
        }));
        return ok({ products: result.Items || [] });
    } catch (error) {
        return internalError('Error interno');
    }
};

// 2. Exportamos la función envuelta con CORS usando el nombre que espera serverless.yml
export const listAllProducts = withCors(listAllProductsHandler);