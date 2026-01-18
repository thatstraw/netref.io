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
```cisco
Router# show clock detail
```
> [!NOTE]  
> A `*` symbol indicates the time is not considered authoritative/synchronized.

### View Device Logs
Accurate time is critical for the timestamps in these logs.
```cisco
Router# show logging
```

---

## Manual Time Configuration

### Set Software Clock
Manually set the system time (not recommended as it will drift).
```cisco
Router# clock set 14:30:00 18 Jan 2024
```

### Set Hardware Calendar
Updates the built-in hardware clock.
```cisco
Router# calendar set 14:30:00 18 Jan 2024
```

### Sync Clock and Calendar
Synchronizes the two internal time sources.
```cisco
# Update hardware calendar from software clock
Router# clock update-calendar

# Update software clock from hardware calendar
Router# clock read-calendar
```

---

## Time Zone & DST

### Configure Time Zone
Sets the offset from UTC.
```cisco
Router(config)# clock timezone JST 9
```

### Configure Daylight Savings
Sets automatic summer time adjustments.
```cisco
Router(config)# clock summer-time EDT recurring
```

---

## NTP Client Configuration

### Add NTP Server
Directs the client to sync with a specific remote server.
```cisco
Router(config)# ntp server 10.1.1.1 prefer
```

### Verify NTP Status
Check synchronization status and stratum levels.
```cisco
# Check reachability and stratum of servers
Router# show ntp associations

# Check local synchronization status
Router# show ntp status
```

> [!TIP]  
> By default, NTP only updates the software clock. Use this command to keep the hardware calendar in sync automatically:
> ```cisco
> Router(config)# ntp update-calendar
> ```

### Set NTP Source
Forces the device to use a specific interface (like Loopback0) for all NTP traffic.
```cisco
Router(config)# ntp source loopback0
```

---

## Advanced NTP Modes

### NTP Master (Server Mode)
Configures the device to act as an NTP server even if it isn't synced to a higher stratum source.
```cisco
# Default stratum is 8 if not specified
Router(config)# ntp master 8
```

### NTP Peering (Symmetric Active)
Allows two devices at the same stratum to synchronize with each other.

```cisco
# R2 configuration
R2(config)# ntp peer <R3 IP Address>

# R3 configuration
R3(config)# ntp peer <R2 IP Address>
```

---

## NTP Authentication

- NTP authentication ensures clients only sync to intended servers.
- It is optional but recommended for security.

### Configure Authentication Keys
```cisco
Router(config)# ntp authenticate

# Create the NTP authentication key(s)
Router(config)# ntp authentication-key 1 md5 ciscolabs

# Specify the trusted key(s)
Router(config)# ntp trusted-key 1

# Specify which key to use for each server
Router(config)# ntp server 10.1.1.1 key 1
```

### Full Multi-Device Example
Ensuring R1 (Server), R2, and R3 (Clients/Peers) are all securely synced.

```cisco
# R1 (NTP Master/Server)
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 ciscolabs
R1(config)# ntp trusted-key 1
R1(config)# ntp master 8

# R2 (Client & Peer)
R2(config)# ntp authenticate
R2(config)# ntp authentication-key 1 md5 ciscolabs
R2(config)# ntp trusted-key 1
R2(config)# ntp server <R1 IP Address> key 1
R2(config)# ntp peer <R3 IP Address> key 1

# R3 (Client & Peer)
R3(config)# ntp authenticate
R3(config)# ntp authentication-key 1 md5 ciscolabs
R3(config)# ntp trusted-key 1
R3(config)# ntp server <R1 IP Address> key 1
R3(config)# ntp peer <R2 IP Address> key 1
```