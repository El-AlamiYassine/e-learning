# Multi-stage Dockerfile for building and running the Spring Boot backend
# Build stage: use Maven to produce the jar
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only what is needed for a cached Maven build
COPY pom.xml mvnw .mvn/ ./
COPY src ./src

# Run maven package (skip tests for faster builds by default)
RUN mvn -B -DskipTests package

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app

ARG JAR_FILE=target/*.jar
COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080
ENV JAVA_OPTS=""

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
