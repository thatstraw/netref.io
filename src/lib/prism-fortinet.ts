export const fortinetGrammar = {
    'comment': {
        pattern: /(^|\n)#.*/,
        lookbehind: true,
        alias: 'italic'
    },
    'prompt': {
        pattern: /^[A-Za-z0-9_-]+[ \t]+\([A-Za-z0-9_-]+\)[ \t]+#/,
        alias: 'bold'
    },
    'keyword': [
        /\b(config|edit|next|end|set|unset|show|get|execute|diagnose|purge|full-configuration)\b/i,
        /\b(system|router|firewall|vpn|webfilter|ips|application|antivirus|log|alertemail|report|switch-controller|user|endpoint-control)\b/i
    ],
    'operator': /\b(policy|address|service|interface|zone|ippool|vip|central-nat|shaping-policy|multicast-policy|proxy-policy)\b/i,
    'string': {
        pattern: /"(?:\\.|[^"\\\r\n])*"/,
        greedy: true
    },
    'number': [
        /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/, // IP
        /\b\d+\b/
    ],
    'variable': /<[^>]+>/,
    'boolean': /\b(enable|disable|up|down|on|off|true|false)\b/i
};
