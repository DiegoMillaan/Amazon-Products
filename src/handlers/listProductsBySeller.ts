// 1. Importamos la función withCors
import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../lib/response';

// 2. Quitamos el export y renombramos la función
const listProductsBySellerHandler = async (event: any) => {
    try {
        const sellerId = event.pathParameters?.sellerId;
        
        const result = await dynamo.send(new QueryCommand({
            TableName: process.env.PRODUCTS_TABLE,
            IndexName: 'sellerIndex',
            KeyConditionExpression: 'sellerId = :sellerId',
            ExpressionAttributeValues: { ':sellerId': sellerId }
        }));

        return ok({ products: result.Items || [] });
    } catch (error) {
        return internalError('Error interno');
    }
};

// 3. Exportamos la función envuelta con CORS
export const listProductsBySeller = withCors(listProductsBySellerHandler);