import { FieldMiddleware, MiddlewareContext } from '@nestjs/graphql';
import { isNull, isUndefined } from '../../common/utils';
import { IContext } from '../../config/interfaces/context.interface';
import { IUser } from '../interface/user.interface';

export const privateMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext<IUser, IContext, unknown>,
  next,
) => {
  const user = ctx.context.req.user;

  if (isUndefined(user) || isNull(user) || ctx.source.id !== user) {
    return null;
  }

  return next();
};
