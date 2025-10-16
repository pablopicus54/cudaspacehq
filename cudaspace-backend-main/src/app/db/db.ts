import {UserRole} from "@prisma/client";
import prisma from "../../shared/prisma";
import {hashPassword} from "../../helpars/passwordHelpers";
import config from "../../config";

export const initiateSuperAdmin = async () => {
  const payload = {
    name: config.superadmin.name || "SuperAdmin",
    number: config.superadmin.number || "1234567890",
    email: config.superadmin.email || "tonmoysifatmd@gmail.com",
    password: config.superadmin.password || "12345678",
    role: UserRole.ADMIN,
  };

  try {
    // Find any existing ADMIN user (super admin)
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingSuperAdmin) {
      // If env email differs and is available, update existing admin email
      if (
        config.superadmin.email &&
        config.superadmin.email !== existingSuperAdmin.email
      ) {
        const emailInUse = await prisma.user.findUnique({
          where: { email: config.superadmin.email },
        });

        if (!emailInUse) {
          await prisma.user.update({
            where: { id: existingSuperAdmin.id },
            data: { email: config.superadmin.email },
          });
        }
      }

      // If env password provided, update admin password (hashed)
      if (config.superadmin.password) {
        const hashed = await hashPassword(config.superadmin.password);
        await prisma.user.update({
          where: { id: existingSuperAdmin.id },
          data: { password: hashed },
        });
      }

      return;
    }

    const hashedPassword = await hashPassword(payload.password);
    payload.password = hashedPassword;

    await prisma.$transaction(async (tx) => {

      const admin = await tx.user.create({
        data: payload,
      });

      await tx.admin.create({
        data: {
          userId: admin.id
        }
      })

    })
  } catch (e) {
    console.error(e);
    throw new Error("Failed to initiate super admin");
  }

};