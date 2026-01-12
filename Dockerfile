# Gunakan image dasar Ubuntu
FROM ubuntu:latest

# Install curl atau software lain yang dibutuhkan
RUN apt-get update && apt-get install -y curl

# Salin aplikasi Anda ke dalam container (misalnya, skrip atau file)
COPY . /app

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Jalankan perintah default (misalnya, menjalankan aplikasi)
CMD ["echo", "Hello, Docker!"]
