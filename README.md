# Forum

A simple web forum built with Go (1.24), React (19), and PostgreSQL (16). \
Frontend uses [Vite](https://github.com/vitejs/vite), [MUI](https://github.com/mui/material-ui), [Zod](https://github.com/colinhacks/zod), [React Hook Form](https://github.com/react-hook-form/react-hook-form), [Tanstack Query](https://github.com/TanStack/query), and [Tanstack Router](https://github.com/TanStack/router). \
Backend uses [chi](https://github.com/go-chi/chi), [golang-jwt](https://github.com/golang-jwt/jwt), and [gorilla/schema](https://github.com/gorilla/schema).

The email and passwords of seeded users can be found in `backend/embed/seed_data/users.json`. \
All their passwords are `password123` and the emails are in the format `{username}@email.com`. \
E.g. For username `admin`, the email is `admin@email.com`.

# Local Development

```bash
# Start PostgreSQL using Docker
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Install Air for hot reloading
go install github.com/air-verse/air@latest

# Backend Setup, in a new terminal
cd backend
# Optionally seed the database
go run cmd/db/main.go -action=seed
# Start backend with hot reloading
air

# Frontend Setup, in a new terminal
cd frontend
# Install dependencies
npm i
# Start frontend development server
npm run dev

# Stop the PostgreSQL container, when done
# -v to remove volume
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

# Production Deployment

docker logs frontend-prod

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Optionally seed the database (although the docker compose file already does this)
docker compose exec backend ./db -action=seed

# To stop the production containers
# add --rmi local to remove local images
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v --rmi local

# To restore a backup
# backups are stored in ./backups
{
  cat backend/embed/sql/drop.sql
  gunzip < backups/postgres*.sql.gz
} | docker exec -i postgres-local \
    psql -U postgres postgres \
```

# AWS Setup

Currently using t4g.micro with a [750 hours per month free trial](https://repost.aws/articles/ARbeHG--bbT6mXw38WgSz01w/announcing-amazon-ec2-t4g-free-trial-extension). \
\
On an EC2 instance (Ubuntu 24.04), run the following commands:

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
ssh-keygen -t rsa -b 4096 -C "email@example.com"
cat ~/.ssh/id_rsa.pub # then add to github
git clone git@github.com:henrlly/forum.git

# Install Docker and Docker Compose
sudo apt-get update -y
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker

# Start docker service
sudo systemctl start docker

# Create .env file
cd forum
cp .env.example .env
vim .env # edit variables as needed
```

##### AI use

AI was used to generate JSON seed data in `/backend/embed/seed_data`
