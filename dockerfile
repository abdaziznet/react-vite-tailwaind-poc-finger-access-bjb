# Gunakan image Nginx sebagai base
FROM nginx:stable-alpine

# Hapus default Nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy file build Vite ke Nginx public directory
COPY dist /usr/share/nginx/html

# Optional: custom nginx config (jika pakai SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
