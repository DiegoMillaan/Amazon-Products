import { withCors } from '../common/cors';
import { dynamo } from '../lib/dynamodb';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ok, internalError } from '../lib/response';

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

export const listAllProducts = withCors(listAllProductsHandler);