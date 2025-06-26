import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return `This action adds a new user ${JSON.stringify(createUserDto)}`;
  }

  findAll() {
    return [
      {
        id: 1,
        name: 'User1',
      },
      {
        id: 2,
        name: 'User2',
      },
    ];
  }

  findOne(id: number) {
    throw new HttpException('User has been removed from the system', 400);
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${JSON.stringify(updateUserDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
