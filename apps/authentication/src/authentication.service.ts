import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

interface UserDTO {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userId?: number;
}

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject('RIDER_SERVICE') private riderService: ClientProxy,
  ) {}

  async register(userDTO: UserDTO) {
    try {
      console.log('called authentication service register', userDTO);
      const hashedPassword = await bcrypt.hash(userDTO.password, 10);

      const user = new User();
      user.email = userDTO.email;
      user.password = hashedPassword;

      const savedUser = await this.userRepository.save(user);

      // call the rider microservice with create-rider command and we will provide
      // firstName, lastName, and userId
      const rider = await firstValueFrom(
        this.riderService.send(
          { cmd: 'create-rider' },
          { userId: savedUser.id, ...userDTO },
        ),
      );
      console.log('rider', rider);

      return { email: savedUser.email };
    } catch (error) {
      console.error('Error while registering user', error);
      throw new Error(error);
    }
  }

  async login(userDTO: UserDTO) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userDTO.email },
      });

      if (!user || !(await bcrypt.compare(userDTO.password, user.password))) {
        throw new Error('Invalid credentials');
      }

      const token = this.jwtService.sign({
        userId: user.id,
        email: user.email,
      });
      return { access_token: token };
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
