import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string | null;

  @Expose()
  email!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date | null;
}
