FROM openjdk:17
VOLUME /tmp
EXPOSE 8080
COPY build/libs/notesapp.jar noteapp.jar
ENTRYPOINT ["java", "-jar", "/noteapp.jar"]