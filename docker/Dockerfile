FROM node:krypton-bookworm

RUN apt-get update
RUN apt-get install -y iproute2 net-tools postgresql-client vim

WORKDIR /root

RUN install -d -m 700 .ssh
ARG SSH_PRIVATE_KEY
RUN echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_ed25519 && chmod 600 /root/.ssh/id_ed25519

RUN ssh-keyscan github.com >> ~/.ssh/known_hosts

RUN mkdir workspace
WORKDIR workspace

RUN npm install git+https://github.com/shlehter/mercur-cli.git
COPY start_mercurjs /usr/bin

CMD ["/usr/bin/start_mercurjs"]
