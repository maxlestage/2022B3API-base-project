#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE devapi;
  \c devapi
  create extension if not exists "uuid-ossp";
EOSQL
 