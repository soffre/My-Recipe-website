FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Clean default assets and copy your locally built 'dist' folder straight in
RUN rm -rf ./*
COPY dist/ .

# Ensure React Router works correctly on custom page refreshes
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
