FROM mysql:8.0

# Environment variables (override these in Render's dashboard)
ENV MYSQL_ROOT_PASSWORD=Tresor92
ENV MYSQL_DATABASE=library_management_db
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=Tresor92

# Initialize database with schema
COPY init.sql /docker-entrypoint-initdb.d/

# Custom MySQL configuration
COPY my.cnf /etc/mysql/conf.d/

# Expose MySQL port
EXPOSE 3306