import { dynamo } from '../lib/dynamodb';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { badRequest, notFound, ok, internalError } from '../lib/response';

export const updateStock = async (event: any) => {
    try {
        const id = event.pathParameters?.id;
        const body = event.body ? JSON.parse(event.body) : {};
        const quantity = body.quantity;

        if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
            return badRequest('La cantidad a restar debe ser un entero positivo');
        }

        const result = await dynamo.send(new GetCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id }
        }));

        if (!result.Item) return notFound('Producto no encontrado');
        if (result.Item.stock < quantity) return badRequest('Stock insuficiente');

        await dynamo.send(new UpdateCommand({
            TableName: process.env.PRODUCTS_TABLE,
            Key: { productId: id },
            UpdateExpression: 'set stock = stock - :quantity, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':quantity': quantity,
                ':updatedAt': new Date().toISOString()
            }
        }));

        return ok({ message: 'Stock actualizado exitosamente' });
    } catch (error) {
        return internalError('Error interno');
    }
};