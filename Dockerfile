FROM oven/bun:latest

WORKDIR /usr/src/smartbrainserver

COPY ./ ./

RUN bun i

CMD ["/bin/bash"]