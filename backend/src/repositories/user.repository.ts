// Data access layer for User model
import { prisma } from "../config/db";

export class UserRepository {
  findByAuth0Id(auth0Id: string) {
    return prisma.user.findUnique({ where: { auth0Id } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  upsertByAuth0Id(data: { auth0Id: string; email: string; username: string }) {
    return prisma.user.upsert({
      where: { auth0Id: data.auth0Id },
      create: {
        auth0Id: data.auth0Id,
        email: data.email,
        username: data.username,
      },
      update: {
        email: data.email,
      },
    });
  }

  updateUsername(id: string, username: string) {
    return prisma.user.update({ where: { id }, data: { username } });
  }
}
