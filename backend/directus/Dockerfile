FROM directus/directus:10.13.4

# Install additional dependencies if needed (like PostgreSQL driver)
RUN npm install pg

# Copy custom extensions if you have any
# COPY ./extensions /directus/extensions

EXPOSE 8055

CMD ["npx", "directus", "start"]