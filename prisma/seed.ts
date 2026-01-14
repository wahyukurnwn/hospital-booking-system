import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { DayOfWeek, Gender, Role } from "@/generated/prisma/client";

async function main() {
  console.log("🌱 Starting seeding...");

  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash("password123", 12);

  // 3. Buat ADMIN
  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@klinik.com",
      password,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin created: admin@klinik.com");

  // 4. Buat DOKTER
  const doctorUser = await prisma.user.create({
    data: {
      name: "Dr. Budi Santoso",
      email: "dokter@klinik.com",
      password,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          name: "Dr. Budi Santoso",
          specialization: "Umum",
          price: 50000,
          bio: "Dokter umum berpengalaman 10 tahun.",

          schedules: {
            createMany: {
              data: [
                {
                  dayOfWeek: DayOfWeek.MONDAY,
                  startTime: "09:00",
                  endTime: "12:00",
                  maxCapacity: 10,
                },

                {
                  dayOfWeek: DayOfWeek.WEDNESDAY,
                  startTime: "13:00",
                  endTime: "16:00",
                  maxCapacity: 10,
                },
              ],
            },
          },
        },
      },
    },
  });
  console.log("✅ Doctor created: Dr. Budi Santoso (Senin & Rabu)");

  // 5. Buat PASIEN (Registered User)
  const patientUser = await prisma.user.create({
    data: {
      name: "Siti Aminah",
      email: "siti@gmail.com",
      password,
      role: Role.PATIENT,
      patientProfile: {
        create: {
          name: "Siti Aminah",
          phone: "081234567890",
          gender: Gender.FEMALE,
          birthDate: new Date("1990-01-01"),
          address: "Jl. Merpati No. 10",
          emergencyName: "Budi (Suami)",
          emergencyPhone: "081298765432",
        },
      },
    },
  });
  console.log("✅ Patient created: siti@gmail.com");

  console.log("🌱 Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
