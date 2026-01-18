export const juniperGrammar = {
    'comment': {
        pattern: /(^|\n)#.*/,
        lookbehind: true,
        alias: 'italic'
    },
    'prompt': {
        pattern: /^[A-Za-z0-9_-]+@[A-Za-z0-9_-]+[#>]|\[edit[ \t]*.*?\]/,
        alias: 'bold'
    },
    'keyword': [
        /\b(set|delete|edit|commit|rollback|show|run|top|up|save|load|replace|exit|quit|request|restart|test|help)\b/i,
        /\b(interfaces|protocols|system|chassis|security|routing-options|logical-systems|groups|policy-options|firewall|snmp|vlans)\b/i
    ],
    'operator': /\b(unit|family|inet|inet6|vpls|mpls|ospf|bgp|static|aggregate|generate|term|from|then|action|next-term)\b/i,
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
