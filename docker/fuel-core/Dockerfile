FROM ghcr.io/fuellabs/fuel-core:v0.35.0

ARG FUEL_IP=0.0.0.0
ARG FUEL_PORT=4001
ARG CONSENSUS_KEY_SECRET="0xc8e615a4089466174459ef19cfd257d2e17adfabff3b8f219dbb5fb4eca87c50"

# dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y curl jq && rm -rf /var/lib/apt/lists/*
RUN apt update && apt install -y git curl jq && rm -rf /var/lib/apt/lists/*

# copy chain config
WORKDIR /fuel

COPY ./genesis_coins.json .

#  Fuel Core 0.35.0, needs to be changed when core version is updated
RUN git clone \
    https://github.com/FuelLabs/chain-configuration.git \
    /chain-configuration && \
    cd /chain-configuration && \
    git checkout 6cea45da59bb105a02fb0b115c7ef03f3a690ba1

# Copy the base local configuration
RUN cp -R /chain-configuration/local/* ./

# Copy the testnet consensus parameters and state transition bytecode
RUN cp /chain-configuration/upgradelog/ignition-devnet/consensus_parameters/6.json \
    ./latest_consensus_parameters.json
RUN cp /chain-configuration/upgradelog/ignition-devnet/state_transition_function/9.wasm \
    ./state_transition_bytecode.wasm

# update local state_config with custom genesis coins config
RUN jq '.coins = input' \
    state_config.json genesis_coins.json > tmp.json \
    && mv tmp.json state_config.json

# update local state_config with testnet consensus parameters
RUN jq '.consensus_parameters = input' \
    state_config.json latest_consensus_parameters.json > tmp.json \
    && mv tmp.json state_config.json

# expose fuel node port
ENV FUEL_IP="${FUEL_IP}"
ENV FUEL_PORT="${FUEL_PORT}"
ENV CONSENSUS_KEY_SECRET="${CONSENSUS_KEY_SECRET}"
EXPOSE ${FUEL_PORT}

# copy over script and run
COPY ./fuel_core.sh .
CMD ["sh", "./fuel_core.sh"]
