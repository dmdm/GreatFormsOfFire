-- Creates database roles and database for this project
-- XXX Must be superuser to run!

-- Do not use same name for user and a schema.
-- That schema then will be in search path, which leads to idiosyncrasies.
CREATE ROLE gfof_user LOGIN ENCRYPTED PASSWORD 'gfof';

CREATE DATABASE greatformsoffire OWNER gfof_user ENCODING 'utf-8';

\c greatformsoffire postgres
CREATE EXTENSION hstore;
CREATE EXTENSION plpython3u;
CREATE EXTENSION "uuid-ossp";

\c greatformsoffire gfof_user

CREATE SCHEMA gfof;
