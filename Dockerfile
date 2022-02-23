FROM hayd/alpine-deno:latest

RUN apk update && \
    apk upgrade
ADD . /home/rymer/
WORKDIR /home/rymer/
ENV BOT_KEY=ODIxNzYwNjUxMTM4Njk1MTk5.YFIaPg.9BWk6KG1YQ-iKLlNUxmsseDd7KU
CMD [ "run", "--allow-net", "--allow-env",  "bot.ts" ]

# docker build -t rymer .
# docker run rymer