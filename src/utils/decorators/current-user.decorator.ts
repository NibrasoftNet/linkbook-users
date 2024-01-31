import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
	(data: keyof JwtPayloadType | undefined, context: ExecutionContext) => {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req.user;
	},
);
