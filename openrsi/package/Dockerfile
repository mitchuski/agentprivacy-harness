FROM node:22-bookworm-slim

# python3 and bash are required by the platform launcher; the rest are the
# general tools a seat uses to read documents and search a workspace.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      python3 bash git ripgrep poppler-utils ca-certificates curl jq \
 && rm -rf /var/lib/apt/lists/*

# The seat client is pinned: the gateway recipe was checked against this version.
RUN npm install -g @anthropic-ai/claude-code@2.1.311 && npm cache clean --force

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ENV HOME=/root

COPY . /opt/harness/
WORKDIR /workspace/repo
