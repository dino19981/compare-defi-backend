import { buildSwaggerSchema } from './lib';
import { TJSONTypeSchema, TSwaggerParams } from './types';

function isSwaggerSchema(
  req: TSwaggerParams | TJSONTypeSchema,
  res: TJSONTypeSchema,
): req is TSwaggerParams {
  const swaggerSchema = req as TSwaggerParams;

  if (res || !req) {
    return false;
  }

  const { schemaRequest, schemaResponse, schemaQuery, isAuth } = swaggerSchema;

  return (
    schemaRequest !== undefined ||
    schemaResponse !== undefined ||
    schemaQuery !== undefined ||
    isAuth !== undefined
  );
}

export function SwaggerSchemaDecorator(
  schemaRequest: TSwaggerParams,
): MethodDecorator;
export function SwaggerSchemaDecorator(
  schemaRequest: TJSONTypeSchema,
  schemaResponse?: TJSONTypeSchema,
): MethodDecorator;
export function SwaggerSchemaDecorator(
  schemaRequest?: TSwaggerParams | TJSONTypeSchema,
  schemaResponse?: TJSONTypeSchema,
): MethodDecorator {
  return (...args: [any, string | symbol, PropertyDescriptor]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const controllerName = args[0]?.constructor?.name || 'Unknown';

    const swaggerSchema = isSwaggerSchema(schemaRequest, schemaResponse)
      ? schemaRequest
      : { schemaRequest, schemaResponse };

    const decorators = buildSwaggerSchema(swaggerSchema, controllerName);

    decorators.forEach((decorator) => decorator(...args));
  };
}
