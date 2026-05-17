export const withCors = (handler: any) => {
    return async (event: any, context: any) => {
        // Ejecutamos la lambda original
        const response = await handler(event, context);
        
        // Le inyectamos los permisos de CORS a la respuesta
        return {
            ...response,
            headers: {
                ...response?.headers,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,PATCH,DELETE'
            }
        };
    };
};