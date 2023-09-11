import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entity/user.entity';

@ObjectType()
export class SignResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  user: UserEntity;
}
