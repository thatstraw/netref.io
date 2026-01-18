export const ciscoGrammar = {
    'comment': {
        pattern: /(^|\n)!.*/,
        lookbehind: true,
        alias: 'italic'
    },
    'prompt': {
        pattern: /^[A-Za-z0-9_-]+(\([^)]+\))?#/,
        alias: 'bold'
    },
    'keyword': [
        /\b(interface|router|ip|ipv6|no|shutdown|description|show|debug|clear|conf|terminal|vlan|line|vty|access-list|route-map|policy-map|service-policy)\b/i,
        /\b(ospf|bgp|eigrp|rip|isis|static|connected|summary|redistribute)\b/i
    ],
    'operator': /\b(permit|deny|remark|any|host|log|eq|range|gt|lt)\b/i,
    'string': [
        {
            pattern: /"(?:\\.|[^"\\\r\n])*"/,
            greedy: true
        },
        {
            pattern: /'.*'/,
            alias: 'string'
        }
    ],
    'number': [
        /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/, // IP Address
        /\b\d+\b/
    ],
    'variable': /<[^>]+>/,
    'boolean': /\b(enable|disable|up|down|on|off|true|false)\b/i
};
