#!/usr/bin/env bash
# Creates all Kafka topics required by ShelfSpace services.
# Assumes Kafka is already running on localhost:9092.

BOOTSTRAP="localhost:9092"

create_topic() {
  local topic="$1"
  local partitions="${2:-3}"
  local replication="${3:-1}"

  if kafka-topics.sh --bootstrap-server "$BOOTSTRAP" --list 2>/dev/null | grep -qx "$topic"; then
    echo "  [skip] $topic already exists"
  else
    kafka-topics.sh \
      --bootstrap-server "$BOOTSTRAP" \
      --create \
      --topic "$topic" \
      --partitions "$partitions" \
      --replication-factor "$replication"
    echo "  [ok]   $topic created (partitions=$partitions, replication=$replication)"
  fi
}

echo "==> Creating ShelfSpace Kafka topics on $BOOTSTRAP"

create_topic "analytics-events" 3 1

echo "==> Done"
