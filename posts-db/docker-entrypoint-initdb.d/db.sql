SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Posts (
  post_uuid uuid DEFAULT uuid_generate_v4(),
  title varchar(255) NOT NULL,
  url varchar(255) DEFAULT '',
  content text,
  author varchar(255) NOT NULL,
  created_ts timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (post_uuid)
);
