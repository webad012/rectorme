FROM ubuntu:20.04

LABEL VERSION="1.0"

RUN apt-get update -y && \ 
    apt-get upgrade -y

RUN apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings 
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install nodejs -y
RUN npm install -g npm@10.2.3 yo generator-code @vscode/vsce

ENV LANG en_US.UTF-8

COPY entrypoint.sh /
RUN chmod +x entrypoint.sh

ENTRYPOINT ./entrypoint.sh && clear && bash