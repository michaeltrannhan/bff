import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { BCRYPT_HASH, NAME_REGEX, SLUG_REGEX } from 'src/common/consts/regex';
import { privateMiddleware } from '../middleware/private.middleware';
import { IUser } from '../interface/user.interface';

@ObjectType('User')
@Directive('@key(fields: "id")')
export class UserEntity implements IUser {
  @Field(() => String)
  @IsUUID()
  public id: string;

  @Field(() => String)
  // @Property({ columnType: 'varchar', length: 100 })
  @IsString()
  @Length(3, 100)
  @Matches(NAME_REGEX, {
    message: 'Name must not have special characters',
  })
  public name: string;

  @Field(() => String)
  // @Property({ columnType: 'varchar', length: 106 })
  @IsString()
  @Length(3, 106)
  @Matches(SLUG_REGEX, {
    message: 'Username must be a valid slug',
  })
  public username: string;

  @Field(() => String, { nullable: true, middleware: [privateMiddleware] })
  // @Property({ columnType: 'varchar', length: 255 })
  @IsString()
  @IsEmail()
  @Length(5, 255)
  public email: string;

  // @Property({ columnType: 'varchar', length: 60 })
  @IsString()
  @Length(59, 60)
  @Matches(BCRYPT_HASH)
  public password: string;

  // @Property({ columnType: 'boolean', default: false })
  @IsBoolean()
  public confirmed: true | false = false;

  // @Property({ onCreate: () => new Date() })
  public createdAt: Date = new Date();

  // @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();

  facebookId: string;

  appleId: string;
  hashedPassword: string;
  isValid: boolean;
  passwordChangedAt: Date;
}
