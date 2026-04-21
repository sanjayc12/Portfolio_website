# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Use a flexible command that can pick up environment variables
CMD ["sh", "-c", "java -jar app.jar --spring.datasource.url=${DATABASE_PUBLIC_URL} --server.port=${PORT:-8080}"]

