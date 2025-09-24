export type VendorKey = "cisco" | "juniper" | "fortinet" | "mikrotik" | "paloalto" | "linux" | "edimax" | "sophos";

export type Vendor = {
  key: VendorKey;
  name: string;
  color: string; // Tailwind class e.g., 'bg-blue-600'
  accent: string; // Tailwind text color for badges
  image: string; // Unsplash image url
};

export type CheatSheet = {
  id: string;
  slug: string;
  title: string;
  vendor: VendorKey;
  description: string;
  tags: string[];
  language: "bash" | "shell" | "text" | "ini" | "json" | "yaml";
  content: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
};

export const VENDORS: Vendor[] = [
  {
    key: "cisco",
    name: "Cisco",
    color: "bg-sky-600",
    accent: "text-sky-600",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "juniper",
    name: "Juniper",
    color: "bg-emerald-600",
    accent: "text-emerald-600",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "fortinet",
    name: "Fortinet",
    color: "bg-rose-600",
    accent: "text-rose-600",
    image:
      "https://images.unsplash.com/photo-1517816428104-797678c7cf0d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "mikrotik",
    name: "Mikrotik",
    color: "bg-amber-600",
    accent: "text-amber-600",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "paloalto",
    name: "Palo Alto",
    color: "bg-orange-600",
    accent: "text-orange-600",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "linux",
    name: "Linux",
    color: "bg-zinc-700",
    accent: "text-zinc-700",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "edimax",
    name: "Edimax",
    color: "bg-indigo-600",
    accent: "text-indigo-600",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "sophos",
    name: "Sophos",
    color: "bg-blue-700",
    accent: "text-blue-700",
    image:
      "https://images.unsplash.com/photo-1517816428104-797678c7cf0d?q=80&w=1200&auto=format&fit=crop",
  },
];

export const CHEATS: CheatSheet[] = [
  {
    id: "1",
    slug: "cisco-ospf-basics",
    title: "Cisco OSPF Basics",
    vendor: "cisco",
    description: "Quick reference for configuring OSPF on Cisco IOS routers.",
    tags: ["routing", "ospf", "ios"],
    language: "bash",
    content: `! Enable OSPF process
router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.0.0.255 area 0
 passive-interface default
 no passive-interface GigabitEthernet0/0
!
! Verify
show ip ospf neighbor
show ip route ospf`,
    difficulty: "Intermediate",
  },
  {
    id: "2",
    slug: "juniper-bgp-template",
    title: "Juniper BGP Template",
    vendor: "juniper",
    description: "Reusable BGP configuration template for JunOS.",
    tags: ["bgp", "routing", "junos"],
    language: "text",
    content: `protocols {
    bgp {
        group EBGP {
            type external;
            export EXPORT-POLICY;
            neighbor 203.0.113.1 {
                peer-as 65001;
            }
        }
    }
}
policy-options {
    policy-statement EXPORT-POLICY {
        term ALLOW-ALL {
            then accept;
        }
    }
}`,
    difficulty: "Advanced",
  },
  {
    id: "3",
    slug: "fortinet-firewall-address-object",
    title: "Fortinet Address Object",
    vendor: "fortinet",
    description: "CLI snippet to create firewall address objects on FortiGate.",
    tags: ["firewall", "objects", "fortios"],
    language: "bash",
    content: `config firewall address
    edit "HQ_Subnet"
        set subnet 10.10.0.0 255.255.0.0
    next
end`,
    difficulty: "Beginner",
  },
  {
    id: "4",
    slug: "mikrotik-vlan-bridge",
    title: "Mikrotik VLAN on Bridge",
    vendor: "mikrotik",
    description: "Setup VLANs on a bridge using RouterOS.",
    tags: ["vlan", "routeros", "switching"],
    language: "bash",
    content: `# Create VLAN interfaces
/interface vlan
add name=vlan10 vlan-id=10 interface=bridge1
add name=vlan20 vlan-id=20 interface=bridge1

# Assign IPs
/ip address
add address=10.10.10.1/24 interface=vlan10
add address=10.10.20.1/24 interface=vlan20`,
    difficulty: "Intermediate",
  },
  {
    id: "5",
    slug: "juniper-basics",
    title: "Juniper Basics",
    vendor: "juniper",
    description: "From boot to CLI modes with essential show commands.",
    tags: ["juniper", "basics", "junos", "cli"],
    language: "text",
    content: `When booting up a Juniper virtual device like vEX or vSRX, you are first presented with a FreeBSD shell environment. Junos runs on top of FreeBSD, and the device boots into this lower-level shell before launching the Junos CLI.

### Default Login

\`\`\`
# At the login prompt, use the following credentials:
# Username: root
# Password: (none — just press Enter)

FreeBSD/amd64 (Amnesiac)
login: root
root@:~ #

# At this point, you are in the Unix shell, not the Junos CLI.
\`\`\`

### Entering the Junos CLI

\`\`\`
# Type 'cli' to access the Junos CLI.

cli

# This brings you to operational mode, indicated by the > prompt:
root>
\`\`\`

### Junos CLI Modes

There are two main modes in the Junos CLI.

### 1. Operational Mode (>)

\`\`\`
# This mode is used for monitoring and controlling the device 
# without changing its configuration.

show interfaces terse     # Quick summary of all interfaces
ping 8.8.8.8              # Test connectivity
request system reboot     # Reboot the device

# To enter configuration mode:
edit
\`\`\`

### 2. Configuration Mode (#)

\`\`\`
# This mode allows you to modify the system configuration.

[edit]
root# set system host-name router1   # Set device hostname
[edit]
root# commit                         # Save changes
[edit]
root# exit                           # Exit configuration mode

# To exit the CLI entirely and return to the FreeBSD shell:
start shell
\`\`\`

### Important: Setting the Root Password

\`\`\`
# Junos requires a root password before any commit will succeed.
# Without it, you'll see:
# Missing mandatory statement: 'root-authentication'
# error: commit failed

[edit]
root# set system root-authentication plain-text-password   # Set root password
[edit]
root# commit                                               # Save configuration
\`\`\`

### Disabling Auto Image Upgrade Messages

\`\`\`
# On lab devices, you may see frequent "Auto Image Upgrade" messages:
# Auto Image Upgrade: DHCP INET Client Unbound interfaces : fxp0.0
# To disable this feature:

[edit]
root# delete chassis auto-image-upgrade   # Disable auto image upgrade
commit                                    # Save the change
\`\`\`

---

## Basic \`show\` Commands for Juniper Switches

### 1. Show System Information

\`\`\`
show version                  # Display Junos version, model, uptime
show system uptime            # Show how long the device has been running
show system users             # List logged-in users
show system processes extensive   # Show processes and CPU usage
\`\`\`

### 2. Show Interfaces

\`\`\`
show interfaces terse                         # Summary of interfaces and IPs
show interfaces ge-0/0/1                      # Detailed status of one interface
show interfaces diagnostics optics ge-0/0/1   # Optical levels (fiber ports)
\`\`\`

### 3. Show VLAN and Bridging

\`\`\`
show vlans                          # List configured VLANs
show ethernet-switching table       # Display MAC address table
show ethernet-switching interfaces  # VLAN membership and port mode
\`\`\`

### 4. Show Spanning Tree Status

\`\`\`
show spanning-tree bridge       # STP bridge ID and priority
show spanning-tree interface    # STP state per interface
show spanning-tree statistics   # STP counters and stats
\`\`\`

### 5. Show Configuration

\`\`\`
show configuration              # Full active configuration
show configuration interfaces   # Interface-specific configuration
show configuration vlans        # VLAN configuration
show configuration protocols    # Protocols (STP, LACP, etc.)
\`\`\`

### 6. Show Chassis and Hardware

\`\`\`
show chassis hardware     # List hardware components and serials
show chassis environment  # Show temperature, fans, power supply
show chassis alarms       # Display alarms and warnings
\`\`\`

### Tip

\`\`\`
# From configuration mode, you don't need to exit to run operational commands.
# Just prefix them with 'run':

run show interfaces terse
\`\`\`
`,
    difficulty: "Beginner",
  },
];

export function getVendorByKey(key: VendorKey): Vendor | undefined {
  return VENDORS.find((v) => v.key === key);
}

export function findCheatBySlug(slug: string): CheatSheet | undefined {
  return CHEATS.find((c) => c.slug === slug);
}

export function searchCheats(query: string, vendor?: VendorKey): CheatSheet[] {
  const q = query.trim().toLowerCase();
  return CHEATS.filter((c) => {
    const matchesVendor = vendor ? c.vendor === vendor : true;
    const matchesQ =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q));
    return matchesVendor && matchesQ;
  });
}