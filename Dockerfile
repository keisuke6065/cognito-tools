FROM node:10.15.3-alpine

ARG VERSION=0.0.13

RUN npm config set unsafe-perm true \
    && npm update -g \
    && npm install -g cognito-tools@${VERSION}

ENTRYPOINT ["cognito-tools"]
