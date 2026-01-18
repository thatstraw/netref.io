---
title: "Juniper Basics"
vendor: "juniper"
feature: "basics"
category: "basics"
tags: ["juniper", "basics", "junos", "cli"]
tested_on: ["Junos OS 21.x", "vSRX", "vEX"]
last_verified: 2026-01-18
difficulty: beginner
description: "From boot to CLI modes with essential show commands."
---

# Juniper JunOS Basics

Junos OS runs on top of FreeBSD. You must transition from the Unix shell to the Junos CLI to manage the device.

## Accessing the CLI

### Default Login
Log in to the FreeBSD shell using default credentials.
```bash
login: root
Password: (none)
```

### Enter Junos CLI
Transition from the shell (`#`) to Junos operational mode (`>`).
```bash
root@:~ # cli
root>
```

---

## Junos CLI Modes

### 1. Operational Mode (`>`)
Used for monitoring, troubleshooting, and viewing status.
```juniper
# View interface summary
root> show interfaces terse

# Test connectivity
root> ping 8.8.8.8

# Enter configuration mode
root> edit
```

### 2. Configuration Mode (`#`)
Used for modifying the candidate configuration. Changes must be committed.
```juniper
[edit]
root# set system host-name router1

# Save changes to active configuration
root# commit

# Exit to operational mode
root# exit
```

> [!TIP]
> You can run operational commands from within configuration mode by prefixing them with `run`:
> ```juniper
> [edit]
> root# run show interfaces terse
> ```

---

## Essential Initial Setup

### Set Root Password
Junos requires a root password before any configuration can be committed.
```juniper
[edit]
root# set system root-authentication plain-text-password
```

### Disable Auto Image Upgrade
Prevents frequent console messages on lab/virtual devices.
```juniper
[edit]
root# delete chassis auto-image-upgrade
root# commit
```

---

## System Monitoring

### Check Hardware & Health
```juniper
# List hardware components and serial numbers
root> show chassis hardware

# Check fans, power, and temperature
root> show chassis environment

# View active system alarms
root> show chassis alarms
```

### Check Software & Uptime
```juniper
# Show Junos version and model
root> show version

# Show device uptime and last reboot
root> show system uptime
```

---

## Interface & Network Status

### Basic Interface Verification
```juniper
# Summary of all interfaces and IP addresses
root> show interfaces terse

# Detailed status and error counters
root> show interfaces ge-0/0/0

# Optical levels for SFP/fiber ports
root> show interfaces diagnostics optics ge-0/0/0
```

### VLAN & Switching
```juniper
# List active VLANs
root> show vlans

# View MAC address table (CAM table)
root> show ethernet-switching table

# Spanning-tree status summary
root> show spanning-tree bridge
```

---

## Viewing Configuration

### View Entire Config
```juniper
# Displays the current active configuration
root> show configuration
```

### View Specific Sections
```juniper
# Show only interface configuration
root> show configuration interfaces

# Show only protocol (OSPF, BGP) configuration
root> show configuration protocols
```