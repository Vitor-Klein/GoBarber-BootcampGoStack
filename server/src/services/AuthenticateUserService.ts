import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import User from '../models/User'

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({ where: { email } })

    if(!user) {
      throw new Error('incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) {
      throw new Error('incorrect email/password combination.');
    }

    const token = sign({  }, '7c11a2130194e87ff7afac3102d5d2a4', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService;
