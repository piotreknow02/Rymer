FROM hayd/alpine-deno:latest

RUN apk update && \
    apk upgrade
ADD . /home/rymer/
WORKDIR /home/rymer/
ENV BOT_KEY=${BOT_KEY}
CMD [ "run", "--allow-net", "--allow-env",  "bot.ts" ]

# docker build -t rymer .
# docker run rymer