// 1. Importamos la función withCors
import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { notFound, ok, internalError } from '../lib/response';

// 2. Quitamos el export y renombramos la función
const getProductHandler = async (event: any) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) return notFound('ID requerido');

        const result = await dynamo.send(new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id }
        }));

        if (!result.Item) return notFound('Producto no encontrado');
        return ok(result.Item);
    } catch (error) {
        return internalError('Error interno');
    }
};

// 3. Exportamos la función envuelta con CORS
export const getProduct = withCors(getProductHandler);