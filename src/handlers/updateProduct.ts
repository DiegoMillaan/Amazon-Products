// 1. Importamos la función withCors
import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { badRequest, forbidden, notFound, ok, internalError } from '../lib/response';

// 2. Quitamos el export y renombramos la función
const updateProductHandler = async (event: any) => {
    try {
        const id = event.pathParameters?.id;
        const callerId = event.requestContext?.authorizer?.userId;
        const body = event.body ? JSON.parse(event.body) : {};

        const result = await dynamo.send(new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id }
        }));

        if (!result.Item) return notFound('Producto no encontrado');
        if (result.Item.sellerId !== callerId) return forbidden('Solo puedes actualizar tus productos');

        await dynamo.send(new UpdateCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id },
            UpdateExpression: 'set #n = :name, description = :desc, price = :price, stock = :stock, updatedAt = :updatedAt',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: {
                ':name': body.name || result.Item.name,
                ':desc': body.description || result.Item.description,
                ':price': body.price !== undefined ? body.price : result.Item.price,
                ':stock': body.stock !== undefined ? body.stock : result.Item.stock,
                ':updatedAt': new Date().toISOString()
            }
        }));

        return ok({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        return internalError('Error interno');
    }
};

// 3. Exportamos la función envuelta con CORS
export const updateProduct = withCors(updateProductHandler);