import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/users/entity/user.entity';
import { IUser } from 'src/users/interface/user.interface';

@ObjectType('Auth')
export abstract class AuthType {
  @Field(() => UserEntity)
  public user: IUser;

  @Field(() => String)
  public accessToken: string;
}
