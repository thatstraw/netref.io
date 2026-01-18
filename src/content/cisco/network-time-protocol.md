---
title: Network Time Protocol
vendor: cisco
feature: ntp
category: services
tags: ["ntp", "time", "clock"]
tested_on: ["IOS XE 17.x", "IOS 15.x"]
last_verified: 2025-09-20
difficulty: beginner
description: Quick reference for Network Time Protocol (NTP).
related: ["/cisco/snmp", "/cisco/syslog"]
---





# Network Time Protocol (NTP)

NTP ensures accurate logging and synchronization across network devices using UDP port 123.

## System Clock Basics

### View Current Time
Displays the software clock and its time source.
```bash
Router# show clock detail
```
> [!NOTE]  
> A `*` symbol indicates the time is not considered authoritative/synchronized.

### View Device Logs
Accurate time is critical for the timestamps in these logs.
```bash
Router# show logging
```

---

## Manual Time Configuration

### Set Software Clock
Manually set the system time (not recommended as it will drift).
```bash
Router# clock set 14:30:00 18 Jan 2024
```

### Set Hardware Calendar
Updates the built-in hardware clock.
```bash
Router# calendar set 14:30:00 18 Jan 2024
```

### Sync Clock and Calendar
Synchronizes the two internal time sources.
```bash
# Update hardware calendar from software clock
Router# clock update-calendar

# Update software clock from hardware calendar
Router# clock read-calendar
```

---

## Time Zone & DST

### Configure Time Zone
Sets the offset from UTC.
```bash
Router(config)# clock timezone JST 9
```

### Configure Daylight Savings
Sets automatic summer time adjustments.
```bash
Router(config)# clock summer-time EDT recurring
```

---

## NTP Client Configuration

### Add NTP Server
Directs the client to sync with a specific remote server.
```bash
Router(config)# ntp server 10.1.1.1 prefer
```

### Verify NTP Status
Check synchronization status and stratum levels.
```bash
# Check reachability and stratum of servers
Router# show ntp associations

# Check local synchronization status
Router# show ntp status
```

> [!TIP]  
> By default, NTP only updates the software clock. Use this command to keep the hardware calendar in sync automatically:
> ```bash
> Router(config)# ntp update-calendar
> ```

### Set NTP Source
Forces the device to use a specific interface (like Loopback0) for all NTP traffic.
```bash
Router(config)# ntp source loopback0
```

---

## Advanced NTP Modes

### NTP Master (Server Mode)
Configures the device to act as an NTP server even if it isn't synced to a higher stratum source.
```bash
# Default stratum is 8 if not specified
Router(config)# ntp master 8
```

### NTP Peering (Symmetric Active)
Allows two devices at the same stratum to synchronize with each other.
Configuring ymetric active mode between R2 and R3

```bash
R2(config)# ntp peer  <R3 IP Address>
R3(config)# ntp peer  <R2 IP Address>
```

---

## NTP Authentication

- NTP authentication can be configured, aulthough it is optional
- It allows NTP clients to ensure they only sync to the intended servers
- To configure NTP authentication:

```
Router(config)# ntp authenticate

# create the NTP authentication key(s)
Router(config)# ntp authentication-key <key-number> md5 <key/password-itself>

# specify the trusted key(s)
Router(config)# ntp trusted-key <key-number>

# specify which key to use for each server
Router(config)# ntp server <ip-address> key <key-number>
# The above command isn't need on the server itself (R1) .
```

### Enable Secure Sync
Optional. Ensures the client only syncs with authorized servers.

```bash

# server configuration
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 ciscolabs
R1(config)# ntp trusted-key 1

# client configuration
R2(config)# ntp authenticate
R2(config)# ntp authentication-key 1 md5 ciscolabs
R2(config)# ntp trusted-key 1
R2(config)# ntp server <R1 IP Address> key 1

# peer configuration
R2(config)# ntp peer <R3 IP address> key 1

# client configuration
R3(config)# ntp authenticate
R3(config)# ntp authentication-key 1 md5 ciscolabs
R3(config)# ntp trusted-key 1
R3(config)# ntp server <R1 IP Address> key 1

# peer configuration
R3(config)# ntp peer <R2 IP address> key 1
```