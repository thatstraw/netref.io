---
title: "DHCP Configuration"
vendor: "cisco"
feature: "dhcp"
category: "services"
tags: ["dhcp", "ip-addressing", "relay"]
tested_on: ["IOS XE 17.x", "IOS 15.x"]
last_verified: 2026-01-19
difficulty: beginner
description: "Configure Cisco IOS as a DHCP Server, Client, or Relay Agent."
related: ["/cisco/network-time-protocol", "/cisco/cdp"]
---

# Dynamic Host Configuration Protocol (DHCP)

DHCP automates the assignment of IP addresses, subnet masks, gateways, and DNS settings to network devices.

## DHCP Server Configuration

### 1. Exclude Static Addresses
Prevent the DHCP server from assigning addresses used by servers or gateways.
```cisco
R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10
```

### 2. Create & Configure Pool
Define the subnet and options for the clients.
```cisco
R1(config)# ip dhcp pool LAB_POOL
# Define the subnet (network mask or prefix)
R1(dhcp-config)# network 192.168.1.0 255.255.255.0

# Define the default gateway for clients
R1(dhcp-config)# default-router 192.168.1.1

# Define DNS server and domain name
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# domain-name cisco.com

# Set lease time (Days Hours Minutes)
R1(dhcp-config)# lease 0 5 30
```

### 3. Verify Server Status
```cisco
# View active IP address leases
R1# show ip dhcp binding

# View DHCP pool statistics and utilization
R1# show ip dhcp pool

# View DHCP server message statistics
R1# show ip dhcp server statistics
```

---

## DHCP Relay Agent
Centralized DHCP servers cannot receive broadcasts from remote subnets. A relay agent converts these broadcasts into unicast traffic directed at the server.

### Configure Helper Address
Apply this to the interface **facing the clients** (the gateway).
```cisco
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip helper-address 192.168.10.10
```
> [!NOTE]
> The `ip helper-address` command forwards more than just DHCP (UDP 67/68); it also forwards TFTP, DNS, Time, and other broadcast services by default.

---

## Device as DHCP Client
Configure a Cisco router interface to learn its IP address from an upstream DHCP server.

### Enable DHCP Client
```cisco
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# ip address dhcp
```

---

## Troubleshooting & Concepts

### The DORA Process
DHCP uses a four-step handshake (UDP Ports 67 Server / 68 Client):
1.  **D**iscover: Client broadcasts to find a server.
2.  **O**ffer: Server suggests an IP address.
3.  **R**equest: Client asks to lease the offered address.
4.  **A**cknowledge (ACK): Server confirms the lease.

| Message | Direction | Traffic Type |
| :--- | :--- | :--- |
| **Discover** | Client → Server | Broadcast |
| **Offer** | Server → Client | Unicast/Broadcast |
| **Request** | Client → Server | Broadcast |
| **ACK** | Server → Client | Unicast/Broadcast |

### Client-Side Commands (Windows)
Use these on a workstation to manage its lease.
```text
# Give up the current IP address
> ipconfig /release

# Request a new IP address from the server
> ipconfig /renew
```

> [!TIP]
> If a client cannot find a DHCP server, it may assign itself an **APIPA** address in the `169.254.x.x` range. This usually indicates a connectivity or DHCP server failure.