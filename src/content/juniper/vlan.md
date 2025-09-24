---
title: Juniper VLAN Configuration
vendor: juniper
feature: vlan
category: switching
tags: ["vlan", "switchport", "dot1q"]
tested_on: ["Junos OS 21.x", "EX Series"]
last_verified: 2025-09-17
difficulty: beginner
description: Quick VLAN configuration for Juniper EX/QFX—access and trunk examples with verification.
related: ["/juniper/lldp", "/juniper/stp"]
---

## Access Port

> [!TIP]
> Use access mode on end devices. Trunks are for uplinks/aggregations.

```bash
configure
set interfaces ge-0/0/10 description "Workstation Port"
set interfaces ge-0/0/10 unit 0 family ethernet-switching port-mode access
set interfaces ge-0/0/10 unit 0 family ethernet-switching vlan members 20
set vlans VLAN20 vlan-id 20
commit and-quit
```

## Trunk Port

> [!NOTE]
> Trunk links carry multiple VLANs. Native VLAN is optional; Junos tags all VLANs by default.

```bash
configure
set interfaces ge-0/0/48 description "Uplink to Distribution"
set interfaces ge-0/0/48 unit 0 family ethernet-switching port-mode trunk
set interfaces ge-0/0/48 unit 0 family ethernet-switching vlan members [ 10 20 30 ]
set vlans VLAN10 vlan-id 10
set vlans VLAN20 vlan-id 20
set vlans VLAN30 vlan-id 30
commit and-quit
```

## Verification

```bash
show vlans                          # Configured VLANs
show ethernet-switching table       # MAC address table
show ethernet-switching interfaces  # Port mode and VLAN membership
show interfaces terse               # Interface operational state
```

## Troubleshooting

> [!WARNING]
> Mismatched VLAN lists or STP blocking can cause traffic loss.

```bash
show spanning-tree interface ge-0/0/48
show ethernet-switching table vlan 20
show log messages | match ge-0/0/48
```

## Save Configuration

```bash
commit