import swagger_autogen from 'swagger-autogen';
import path from 'path';

const rootPath = process.cwd();
const swaggerAutogen = swagger_autogen();

const outputFile = path.join(rootPath, 'swagger_output.json'); // 輸出的文件名稱
const endpointsFiles = [path.join(rootPath, 'script/config/router/expressRouter.js')]; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

export default swaggerAutogen(outputFile, endpointsFiles); // swaggerAutogen 的方法