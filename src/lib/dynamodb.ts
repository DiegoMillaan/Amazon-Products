import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Creamos el cliente base
const client = new DynamoDBClient({});

// El DocumentClient nos facilita mandar JSONs de JavaScript directamente a la BD
export const dynamo = DynamoDBDocumentClient.from(client);