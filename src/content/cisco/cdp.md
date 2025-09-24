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


### Enable or Disable CDP Globally

```bash
Router(config)# cdp run        # Enable CDP globally (default on Cisco devices)
Router(config)# no cdp run     # Disable CDP globally
```

### Enable or Disable CDP on an Interface

```bash
Router(config-if)# cdp enable       # Enable CDP on the interface
Router(config-if)# no cdp enable    # Disable CDP on the interface
```

### Verify CDP Neighbors

```bash
Router# show cdp neighbors
# Displays directly connected Cisco devices, their interfaces, and capabilities.
```

### Detailed Information About Neighbors

```bash
Router# show cdp neighbors detail
# Includes IP addresses, platform, software version, and more.
```

### CDP Timer and Holdtime

```bash
Router(config)# cdp timer 30
# Sets CDP advertisement interval (default: 60 seconds)

Router(config)# cdp holdtime 120
# Sets how long (in seconds) to hold neighbor info before discarding (default: 180 seconds)
```

### CDP Traffic Information

```bash
Router# show cdp traffic
# Displays CDP packets sent/received and errors.
```

### View CDP Information for a Specific Interface

```bash
Router# show cdp interface GigabitEthernet0/0
# Displays CDP status, timer, and holdtime settings for a specific interface.
```

### Disable CDP on All Interfaces (Best Practice on Edge Ports)

```bash
Router(config)# no cdp run
# Turns off CDP globally for security on external-facing interfaces.
```

> [!WARNING]  
> CDP should usually be disabled on interfaces that face untrusted networks (like the Internet) since it exposes device details that could aid an attacker.  
> Keep it enabled only on internal/trusted links where network discovery is useful.

