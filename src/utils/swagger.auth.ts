import { appConfig } from 'src/app.config';

const apiDocCredentials = {
  username: appConfig.apiAuthUserName,
  password: appConfig.apiAuthPassword,
};

export class ApiDocProtected {
  private _httpAdapter: any;
  constructor(httpAdapter: any) {
    this._httpAdapter = httpAdapter;
  }

  enabled = () => {
    this._httpAdapter.use('/docs', (req, res, next) => {
      function parseAuthHeader(input: string): {
        username: string;
        password: string;
      } {
        const [, encodedPart] = input.split(' ');
        const buff = Buffer.from(encodedPart, 'base64');
        const text = buff.toString('ascii');
        const [username, password] = text.split(':');
        return { username, password };
      }
      function unauthorizedResponse(): void {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic');
        next();
      }
      if (!req.headers.authorization) {
        return unauthorizedResponse();
      }
      const credentials = parseAuthHeader(req.headers.authorization);
      if (
        credentials?.username !== apiDocCredentials.username ||
        credentials?.password !== apiDocCredentials.password
      ) {
        return unauthorizedResponse();
      }
      next();
    });
  };
}
