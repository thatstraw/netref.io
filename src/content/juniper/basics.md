---
title: "Juniper Basics"
vendor: "juniper"
description: "From boot to CLI modes with essential show commands."
tags: ["juniper", "basics", "junos", "cli"]
---

When booting up a Juniper virtual device like vEX or vSRX, you are first presented with a FreeBSD shell environment. Junos runs on top of FreeBSD, and the device boots into this lower-level shell before launching the Junos CLI.

### Default Login

```
# At the login prompt, use the following credentials:
# Username: root
# Password: (none — just press Enter)

FreeBSD/amd64 (Amnesiac)
login: root
root@:~ #

# At this point, you are in the Unix shell, not the Junos CLI.
```

### Entering the Junos CLI

```
# Type 'cli' to access the Junos CLI.

cli

# This brings you to operational mode, indicated by the > prompt:
root>
```

### Junos CLI Modes

There are two main modes in the Junos CLI.

### 1. Operational Mode (`>`)

```
# This mode is used for monitoring and controlling the device 
# without changing its configuration.

show interfaces terse     # Quick summary of all interfaces
ping 8.8.8.8              # Test connectivity
request system reboot     # Reboot the device

# To enter configuration mode:
edit
```

### 2. Configuration Mode (`#`)

```
# This mode allows you to modify the system configuration.

[edit]
root# set system host-name router1   # Set device hostname
[edit]
root# commit                         # Save changes
[edit]
root# exit                           # Exit configuration mode

# To exit the CLI entirely and return to the FreeBSD shell:
start shell
```

### Important: Setting the Root Password

```
# Junos requires a root password before any commit will succeed.
# Without it, you'll see:
# Missing mandatory statement: 'root-authentication'
# error: commit failed

[edit]
root# set system root-authentication plain-text-password   # Set root password
[edit]
root# commit                                               # Save configuration
```

### Disabling Auto Image Upgrade Messages

```
# On lab devices, you may see frequent “Auto Image Upgrade” messages:
# Auto Image Upgrade: DHCP INET Client Unbound interfaces : fxp0.0
# To disable this feature:

[edit]
root# delete chassis auto-image-upgrade   # Disable auto image upgrade
commit                                    # Save the change
```

---

## Basic `show` Commands for Juniper Switches

### 1. Show System Information

```
show version                  # Display Junos version, model, uptime
show system uptime            # Show how long the device has been running
show system users             # List logged-in users
show system processes extensive   # Show processes and CPU usage
```

### 2. Show Interfaces

```
show interfaces terse                         # Summary of interfaces and IPs
show interfaces ge-0/0/1                      # Detailed status of one interface
show interfaces diagnostics optics ge-0/0/1   # Optical levels (fiber ports)
```

### 3. Show VLAN and Bridging

```
show vlans                          # List configured VLANs
show ethernet-switching table       # Display MAC address table
show ethernet-switching interfaces  # VLAN membership and port mode
```

### 4. Show Spanning Tree Status

```
show spanning-tree bridge       # STP bridge ID and priority
show spanning-tree interface    # STP state per interface
show spanning-tree statistics   # STP counters and stats
```

### 5. Show Configuration

```
# Full active configuration
show configuration   

# Interface-specific configuration
show configuration interfaces   

 # VLAN configuration
show configuration vlans 

 # Protocols (STP, LACP, etc.)
show configuration protocols   
```

### 6. Show Chassis and Hardware

```
show chassis hardware     # List hardware components and serials
show chassis environment  # Show temperature, fans, power supply
show chassis alarms       # Display alarms and warnings
```


> [!TIP] From configuration mode, you don’t need to exit to run operational commands. Just prefix them with 'run': 
>
> ```bash
> run show interfaces terse
> ```