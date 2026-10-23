import { prisma } from "@/src/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  // 1. Create the plan.
  const plan = await prisma.plan.upsert({
    where: { name: "Premium" },
    update: {},
    create: { name: "Premium" },
  });

  // 2. Seed the features included in this plan.
  const featureKeys = [
    "multiple_branches",
    "product_options",
    "promotions",
    "reports",
    "team_management",
    "custom_theme",
    "online_orders",
  ];

  for (const featureKey of featureKeys) {
    await prisma.planFeature.upsert({
      where: {
        planId_featureKey: {
          planId: plan.id,
          featureKey,
        },
      },
      update: {},
      create: {
        planId: plan.id,
        featureKey,
      },
    });
  }

  // 3. Create one location hierarchy.
  // Your current schema starts at Governorate, not Country.
  let governorate = await prisma.governorate.findFirst({
    where: { nameEn: "Minya" },
  });

  if (!governorate) {
    governorate = await prisma.governorate.create({
      data: {
        nameAr: "المنيا",
        nameEn: "Minya",
      },
    });
  }

  const city = await prisma.city.upsert({
    where: {
      governorateId_nameEn: {
        governorateId: governorate.id,
        nameEn: "Minya",
      },
    },
    update: {},
    create: {
      nameAr: "المنيا",
      nameEn: "Minya",
      governorateId: governorate.id,
    },
  });

  const district = await prisma.district.upsert({
    where: {
      cityId_nameEn: {
        cityId: city.id,
        nameEn: "Minya Center",
      },
    },
    update: {},
    create: {
      nameAr: "مركز المنيا",
      nameEn: "Minya Center",
      cityId: city.id,
    },
  });

  // 4. Create one organization and its settings.
  // Organization currently has no unique name constraint,
  // so findFirst is used to keep this seed repeatable.
  let organization = await prisma.organization.findFirst({
    where: { name: "Demo Restaurant" },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: "Demo Restaurant",
        brandNameAr: "مطعم تجريبي",
        brandNameEn: "Demo Restaurant",
        planId: plan.id,
        settings: {
          create: {
            showCategory: true,
            showSubCategory: true,
            showRating: true,
            showOpeningHours: true,
          },
        },
      },
    });
  }

  // 5. Create the organization's Owner role.
  const ownerRole = await prisma.role.upsert({
    where: {
      organizationId_name: {
        organizationId: organization.id,
        name: "Owner",
      },
    },
    update: {
      type: "OWNER",
    },
    create: {
      name: "Owner",
      type: "OWNER",
      organizationId: organization.id,
    },
  });

  // 6. Create one owner user.
  const email = process.env.SEED_OWNER_EMAIL ?? "owner@example.com";
  const phone = process.env.SEED_OWNER_PHONE ?? "+201000000000";
  const password = process.env.SEED_OWNER_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      organizationId: organization.id,
      roleId: ownerRole.id,
    },
    create: {
      email,
      phone,
      passwordHash,
      organizationId: organization.id,
      roleId: ownerRole.id,
      isActive: true,
    },
  });

  console.log("Seed completed successfully.");
  console.log({
    plan: plan.name,
    organization: organization.name,
    ownerEmail: email,
    governorate: governorate.nameEn,
    city: city.nameEn,
    district: district.nameEn,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
