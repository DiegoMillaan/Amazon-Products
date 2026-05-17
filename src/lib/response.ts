import { APIGatewayProxyResult } from 'aws-lambda';

export const ok = (data: any): APIGatewayProxyResult => {
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

export const badRequest = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 400,
        body: JSON.stringify({ message })
    };
};

export const serverError = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 500,
        body: JSON.stringify({ message })
    };
};

export const unauthorized = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 401,
        body: JSON.stringify({ message })
    };
};

export const notFound = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 404,
        body: JSON.stringify({ message })
    };
};

export const internalError = (message: string): APIGatewayProxyResult => {
    return {
        statusCode: 500,
        body: JSON.stringify({ message })
    };
};

export const forbidden = (message: string) => {
    return { statusCode: 403, body: JSON.stringify({ message }) };
};

export const created = (data: any) => {
    return { statusCode: 201, body: JSON.stringify(data) };
};