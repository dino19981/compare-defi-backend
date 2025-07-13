import { ApiBody, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TSwaggerParams } from '../types';
import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const REF_PREFIX = '#/components/schemas/';

export const buildSwaggerSchema = (
  swaggerParams: TSwaggerParams,
  tag: string = 'default',
): MethodDecorator[] => {
  const decorators: Array<MethodDecorator> = [];

  const {
    schemaRequest,
    schemaResponse = undefined,
    description,
    schemaQuery,
    isAuth,
  } = swaggerParams;

  // decorators.push(ApiTags(tag));

  if (isAuth) {
    decorators.push(applyDecorators(ApiBearerAuth()));
  }

  decorators.push(
    ApiOperation({
      ...(description && { summary: description }),
      tags: [tag],
    }),
  );

  if (schemaQuery) {
    decorators.push(
      ApiQuery({
        name: 'query',
        required: false,
        schema: {
          $ref: `${REF_PREFIX}${schemaQuery.name}`,
        },
      }),
    );
  }

  if (schemaRequest) {
    decorators.push(
      ApiBody({
        type: schemaRequest,
        schema: { $ref: `${REF_PREFIX}${schemaRequest.name}` },
      }),
    );
  }

  if (schemaResponse) {
    decorators.push(
      ApiResponse({
        type: schemaResponse,
        schema: { $ref: `${REF_PREFIX}${schemaResponse.name}` },
        status: 200,
      }),
    );
  } else {
    decorators.push(ApiResponse({ status: 204 }));
  }

  return decorators;
};
