// 1. Importamos la función withCors
import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { forbidden, notFound, ok, internalError } from '../lib/response';

// 2. Quitamos el export y renombramos la función
const deleteProductHandler = async (event: any) => {
    try {
        const id = event.pathParameters?.id;
        const callerId = event.requestContext?.authorizer?.userId;

        const result = await dynamo.send(new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id }
        }));

        if (!result.Item) return notFound('Producto no encontrado');
        if (result.Item.sellerId !== callerId) return forbidden('Solo puedes borrar tus productos');

        await dynamo.send(new DeleteCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id }
        }));

        return ok({ message: 'Producto borrado exitosamente' });
    } catch (error) {
        return internalError('Error interno');
    }
};

// 3. Exportamos la función envuelta con CORS
export const deleteProduct = withCors(deleteProductHandler);