FROM postgres:11.5-alpine

ENV POSTGRES_DB posts

COPY docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

EXPOSE 5432