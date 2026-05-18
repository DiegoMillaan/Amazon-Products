import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../lib/response';

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

export const listProductsBySeller = withCors(listProductsBySellerHandler);