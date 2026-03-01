// Business logic for user operations
import { UserRepository } from "../repositories/user.repository";
import { notFound } from "../utils/errors";

const userRepository = new UserRepository();

export class UserService {
  async getOrCreateUser(auth0Id: string, email: string) {
    const prefix = email.split("@")[0] || "user";
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${prefix}${suffix}`;

    return userRepository.upsertByAuth0Id({ auth0Id, email, username });
  }

  async getUserProfile(auth0Id: string) {
    const user = await userRepository.findByAuth0Id(auth0Id);
    if (!user) throw notFound("User not found");
    return user;
  }

  async updateUsername(auth0Id: string, newUsername: string) {
    const user = await userRepository.findByAuth0Id(auth0Id);
    if (!user) throw notFound("User not found");
    return userRepository.updateUsername(user.id, newUsername);
  }
}
