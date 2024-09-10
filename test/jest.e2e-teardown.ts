import { APP_TEST_DB_COMPOSE_FILE } from './test.constants';

module.exports = async () => {
  // Stop the Docker container
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { exec } = require('child_process');
  await new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const os = require('os');

    const isLinux = os.platform() === 'linux';
    const dockerComposeCmd = isLinux ? 'sudo docker compose' : 'docker-compose';

    exec(
      `${dockerComposeCmd} -p test -f ${APP_TEST_DB_COMPOSE_FILE} down -v`,
      (err, stdout, stderr) => {
        if (err) {
          console.error('Failed to stop Docker container:', stderr);
          reject(err);
        } else {
          console.log('Docker container stopped');
          resolve(stdout);
        }
      },
    );
  });
};
