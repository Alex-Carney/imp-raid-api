CREATE DATABASE IF NOT EXISTS raidsdb;
CREATE USER IF NOT EXISTS 'localdb'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON raidsdb.* TO 'localdb'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'localdb'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
