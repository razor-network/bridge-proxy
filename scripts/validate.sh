#!/usr/bin/env bash
export $(grep -v -e '^#'  -e '^MNEMONIC' .env | xargs -0)
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Validating Timestamp between Native and $NETWORK"

npx hardhat run scripts/validateTimestamp.js  --network $NETWORK

echo "Done"