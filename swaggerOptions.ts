import { Options } from "swagger-jsdoc";

const options: Options = {
    definition: {
        openapi: '3.0.1',
        info: {
            title:'Weeshr Test',
            version: '1.0.0',
            description:"This is a test for Weeshr API",
        },
        servers:[
            {
                url:'http://localhost:3001',
            }
        ],
    },
    apis: ["./src/routes/*.router.ts"],
};

export { options }