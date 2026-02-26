# MyErossence Agents Plugin

8 agenți AI pentru MyErossence premium hair care affiliate site.

## Agenți

| Comandă | Agent | Ce face |
|---------|-------|---------|
| `/myerossence-agents:master` | Project Manager | Overview, orchestrare, planificare, setup conturi |
| `/myerossence-agents:agent-analytics` | Analytics | Rapoarte performanță, KPIs, benchmark-uri |
| `/myerossence-agents:agent-links` | Link Checker | Verifică health linkuri affiliate |
| `/myerossence-agents:agent-affiliates` | Affiliates | Gestionează programe affiliate |
| `/myerossence-agents:agent-prices` | Prices | Monitorizează prețuri, alertează drops |
| `/myerossence-agents:agent-content` | Content | Generează articole HTML blog |
| `/myerossence-agents:agent-seo` | SEO | Optimizare SEO, Schema.org, sitemap |
| `/myerossence-agents:agent-social` | Social Media | Content Instagram, TikTok, Pinterest, YouTube |

## Instalare

### Opțiunea 1: Local (pentru testare)
```bash
claude --plugin-dir ./myerossence-agents
```

### Opțiunea 2: Din directorul proiectului
Copiază folderul `myerossence-agents/` în proiectul tău, apoi:
```bash
claude --plugin-dir ./myerossence-agents
```

### Opțiunea 3: Instalare standalone skills (fără plugin)
Copiază conținutul `skills/` în `.claude/skills/` din proiectul tău:
```bash
cp -r myerossence-agents/skills/* .claude/skills/
```
Apoi skills-urile devin disponibile direct ca `/master`, `/agent-analytics`, etc.

## Cerințe

- Claude Code 1.0.33+
- Supabase MCP server configurat (token în env: `SUPABASE_ACCESS_TOKEN`)
- Proiect Supabase: `xccgzfitbszowyqbnccj`

## Structură

```
myerossence-agents/
├── .claude-plugin/
│   └── plugin.json          # Manifest plugin
├── skills/
│   ├── master/SKILL.md      # Project Manager
│   ├── agent-analytics/     # Analytics Reporter
│   ├── agent-links/         # Link Checker
│   ├── agent-affiliates/    # Affiliate Manager
│   ├── agent-prices/        # Price Monitor
│   ├── agent-content/       # Content Generator
│   ├── agent-seo/           # SEO Pusher
│   └── agent-social/        # Social Media Generator
├── .mcp.json                # Supabase MCP config
├── settings.json            # Permisiuni default
└── README.md
```
