// Load environment variables from .env.test
// eslint-disable-next-line @typescript-eslint/no-var-requires

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { APP_TEST_DB_COMPOSE_FILE, APP_TEST_ROOT_DIR } from './test.constants';

require('dotenv').config({ path: `${APP_TEST_ROOT_DIR}.env.e2e-tests` });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require('util'); // DO NOT CONVERT TO IMPORT
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util.promisify(require('child_process').exec);

async function removeExistingContainersAndVolumes(dockerComposeCmd) {
  try {
    // Stop and remove any existing container
    await exec(
      `${dockerComposeCmd} -p test -f ${APP_TEST_DB_COMPOSE_FILE} down --volumes`,
    );
    console.log('Previous Docker containers and volumes removed successfully.');
  } catch (error) {
    console.error(
      'Error removing existing Docker containers or volumes:',
      error,
    );
  }
}

async function migrateDatabase() {
  console.log('Initiating database migration...');
  try {
    console.log('Initiating database migration...');
    console.log('Current environment variables:');
    console.log(process.env);
    const migrationOutput = await exec('npx prisma migrate deploy');
    console.log('Database migration successful:');
    console.log(migrationOutput.stdout);
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
}

async function seedDatabase() {
  console.log('Initiating database seeding...');
  console.log('Seeding database on port ' + process.env.DB_PORT);
  try {
    // Using a specific seed file for the test environment
    const seedOutput = await exec('npx prisma db seed');
    console.log('Database seeding successful:');
    console.log(seedOutput.stdout);
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
}

module.exports = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const os = require('os');

  const isLinux = os.platform() === 'linux';
  const dockerComposeCmd = isLinux ? 'sudo docker compose' : 'docker-compose';

  console.log(
    'Ensuring that any existing Docker containers and volumes are removed...',
  );
  await removeExistingContainersAndVolumes(dockerComposeCmd);

  console.log('Starting test database container...');
  try {
    const dockerOutput = await exec(
      `${dockerComposeCmd} -p test -f ${APP_TEST_DB_COMPOSE_FILE} up -d`,
    );
    console.log('Docker container for test database has started successfully:');
    console.log(dockerOutput.stdout);

    await migrateDatabase();
    await seedDatabase(); // Seed the database after migration
  } catch (error) {
    console.error('Failed to start Docker container:', error);
    throw error;
  }
};
