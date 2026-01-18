---
title: Cisco CDP Configuration
vendor: cisco
feature: cdp
category: discovery
tags: ["cdp", "discovery", "neighbors"]
tested_on: ["IOS XE 17.x", "IOS 15.x"]
last_verified: 2025-09-20
difficulty: beginner
description: Quick reference for enabling, disabling, and verifying Cisco Discovery Protocol (CDP).
related: ["/cisco/lldp", "/cisco/vlan"]
---

# Cisco Discovery Protocol (CDP)

CDP is a proprietary Cisco protocol used to discover directly connected Cisco neighbors.

## Global Configuration

### Enable CDP Globally
CDP is enabled by default on most Cisco devices.
```cisco
Router(config)# cdp run
```

### Disable CDP Globally
Recommended for security if network discovery is not needed.
```cisco
Router(config)# no cdp run
```

---

## Interface Configuration

### Enable CDP on Interface
Must be enabled globally first for this to have an effect.
```cisco
Router(config-if)# cdp enable
```

### Disable CDP on Interface
Useful for security on external-facing (Untrusted/Internet) ports.
```cisco
Router(config-if)# no cdp enable
```

---

## Verification & Monitoring

### View Summary of Neighbors
Displays basic info: Device ID, Local Intrfce, Holdtime, Capability, Platform, Port ID.
```cisco
Router# show cdp neighbors
```

### View Detailed Neighbor Info
Includes IP addresses, IOS version, and duplex settings.
```cisco
Router# show cdp neighbors detail
```

### View CDP Interface Status
Checks if CDP is running on specific interfaces and shows timers.
```cisco
Router# show cdp interface gigabitEthernet 0/1
```

### View CDP Traffic Stats
Displays counters for packets sent, received, and errors.
```cisco
Router# show cdp traffic
```

---

## Timers & Tuning

### Set Advertisement Timer
Frequency (in seconds) that CDP packets are sent out.
```cisco
Router(config)# cdp timer 30
```

### Set Holdtime
How long a neighbor should keep the info before aging it out.
```cisco
Router(config)# cdp holdtime 120
```

> [!WARNING]  
> CDP should usually be disabled on interfaces that face untrusted networks (like the Internet) since it exposes device details that could aid an attacker.  
> Keep it enabled only on internal/trusted links where network discovery is useful.
