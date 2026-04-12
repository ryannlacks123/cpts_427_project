import prisma from '../src/utils/db';
import { hashPassword } from '../src/utils/password';

/**
 * Seed the database with initial data
 */
async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create roles
    console.log('Creating roles...');
    const roles = ['ADMIN', 'EVENT_MANAGER', 'STAFF', 'VIEWER'];
    
    for (const roleName of roles) {
      await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName },
      });
    }
    console.log('✅ Roles created');

    // Create admin user
    console.log('Creating admin user...');
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin123!';
    const hashedPassword = await hashPassword(adminPassword);

    const adminUser = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: 'Admin User',
      },
    });

    // Assign ADMIN role to admin user
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
    if (adminRole) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: adminUser.id,
            roleId: adminRole.id,
          },
        },
        update: {},
        create: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      });
    }
    console.log('✅ Admin user created');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    // Create sample event manager user
    console.log('Creating event manager user...');
    const managerEmail = 'manager@example.com';
    const managerPassword = 'Manager123!';
    const managerHashedPassword = await hashPassword(managerPassword);

    const managerUser = await prisma.user.upsert({
      where: { email: managerEmail },
      update: {},
      create: {
        email: managerEmail,
        passwordHash: managerHashedPassword,
        name: 'Event Manager',
      },
    });

    const managerRole = await prisma.role.findUnique({ 
      where: { name: 'EVENT_MANAGER' } 
    });
    if (managerRole) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: managerUser.id,
            roleId: managerRole.id,
          },
        },
        update: {},
        create: {
          userId: managerUser.id,
          roleId: managerRole.id,
        },
      });
    }
    console.log('✅ Event manager user created');
    console.log(`   Email: ${managerEmail}`);
    console.log(`   Password: ${managerPassword}`);

    // Create sample vendors
    console.log('Creating sample vendors...');
    const vendor1 = await prisma.vendor.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'EventPro Equipment',
        contactName: 'John Doe',
        contactEmail: 'john@eventpro.com',
        phone: '555-0100',
      },
    });

    const vendor2 = await prisma.vendor.upsert({
      where: { id: '00000000-0000-0000-0000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Party Supplies Co',
        contactName: 'Jane Smith',
        contactEmail: 'jane@partysupplies.com',
        phone: '555-0200',
      },
    });
    console.log('✅ Sample vendors created');

    // Create sample resources
    console.log('Creating sample resources...');
    await prisma.resource.createMany({
      data: [
        {
          name: 'Folding Chairs',
          category: 'Furniture',
          description: 'Standard black folding chairs',
          vendorId: vendor1.id,
          totalQuantity: 200,
        },
        {
          name: 'Round Tables (6ft)',
          category: 'Furniture',
          description: '6-foot round tables with white tablecloths',
          vendorId: vendor1.id,
          totalQuantity: 50,
        },
        {
          name: 'Sound System',
          category: 'Audio/Visual',
          description: 'Professional PA system with microphones',
          vendorId: vendor1.id,
          totalQuantity: 5,
        },
        {
          name: 'Projector & Screen',
          category: 'Audio/Visual',
          description: 'HD projector with 10ft screen',
          vendorId: vendor1.id,
          totalQuantity: 3,
        },
        {
          name: 'Party Tent (20x20)',
          category: 'Outdoor',
          description: 'Weather-resistant party tent',
          vendorId: vendor2.id,
          totalQuantity: 10,
        },
        {
          name: 'Catering Supplies Kit',
          category: 'Catering',
          description: 'Includes plates, utensils, napkins for 100 guests',
          vendorId: vendor2.id,
          totalQuantity: 20,
        },
      ],
      skipDuplicates: true,
    });
    console.log('✅ Sample resources created');

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📝 Login credentials:');
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
    console.log(`   Manager: ${managerEmail} / ${managerPassword}`);
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
