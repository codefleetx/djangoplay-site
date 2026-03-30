(function() {
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];
  
  // 1. Define the 2-hour window (seed)
  const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 4));
  
  // 1. Local seed test in the console, otherwise use the 6-hour timer
  // const debugSeed = localStorage.getItem('debug_seed');
  // const seed = debugSeed ? parseInt(debugSeed) : Math.floor(Date.now() / (1000 * 60 * 60 * 6));

  // Each block contains ["filename", [lines of code] ]
  const allBlocks = [
  
    {
      file: "mailer/adapters/get_user.py",
      lines: [
        "# DjangoPlay · Mailer Adapter",
        "# Author: Chandrashekhar Bhosale",
        `# Date: ${todayStr}`,
        "",
        "def to_email_user(user) -> EmailUser | None:",
        '    """Convert a Django user-like object to EmailUser."""',
        "    if user is None:",
        "        return None",
        "",
        "    return EmailUser(",
        "        id=getattr(user, 'id', None),",
        "        email=getattr(user, 'email', None),",
        "        is_active=getattr(user, 'is_active', True),",
        "    )"
      ]
    },
    {
      file: "core/models/audit.py",
      lines: [
        "# DjangoPlay · Audit Tracking",
        "# Author: Chandrashekhar Bhosale",
        `# Date: ${todayStr}`,
        "",
        "class ActiveManager(models.Manager):",
        '    """Filter out soft-deleted records."""',
        "    def get_queryset(self):",
        "        return super().get_queryset().filter(",
        "            deleted_at__isnull=True, is_active=True)",
        "",
        "class AuditFieldsModel(models.Model):",
        '    """Abstract base class for audit fields."""',
        "    created_by = models.ForeignKey(",
        "        settings.AUTH_USER_MODEL,",
        "        related_name='%(class)s_created_by',",
        "        on_delete=models.SET_NULL,",
        "        null=True, blank=True",
        "    )",
        "   deleted_at = models.DateTimeField(null=True, blank=True)",
        "    class Meta:",
        "        abstract = True"
      ]
    },
    {
      file: "core/utils/request_context.py",
      lines: [
        "# DjangoPlay · Context Variables",
        "# Author: Chandrashekhar Bhosale",
        `# Date: ${todayStr}`,
        "",
        "from contextvars import ContextVar",
        "from types import SimpleNamespace",
        "",
        "client_ip: ContextVar[str] = ContextVar('ip')",
        "request_id: ContextVar[str] = ContextVar('id')",
        "class _ThreadLocalCompat(SimpleNamespace):",
      '    """',
      "    Compatibility shim for legacy thread locals.",
      '    """',
        "    @property",
        "    def client_ip(self):",
        "        return client_ip.get()",
        "",
        "thread_local = _ThreadLocalCompat()"
      ]
    },
    {
      file: "policyengine/api/permissions.py",
      lines: [
        "# DjangoPlay · Permissions",
        "# Author: Chandrashekhar Bhosale",
        `# Date: ${todayStr}`,
        "",
        "class ActionBasedPermission(BasePermission):",
        '    """Restrict actions based on roles and flags."""',
        "    def __init__(self, allowed_actions=None):",
        "        self.actions = allowed_actions or {}",
        "",
        "    def _is_feature_enabled(self, key, user):",
        "        cache_key = f'feature:{key}:{user.id}'",
        "        cached = redis_client.get(cache_key)",
        "        if cached is not None:",
        "            return cached == b'1'",
        "        return False"
      ]
    }
  ];

  const getLinearIndex = (s, max) => {
    return s % max;
  };
  const selectedData = allBlocks[getLinearIndex(seed, allBlocks.length)];
  const code = selectedData.lines;
  const fileName = selectedData.file;

  let line = 0, char = 0;
  const el = document.getElementById("code-animate");
  const fileEl = document.querySelector(".code-filename");

  // Update the header filename before starting
  if (fileEl) fileEl.textContent = fileName;

  const highlight = (txt) => {
    return txt.replace(/&/g, "&amp;").replace(/</g, "&lt;")      
      .replace(/("""[\s\S]*?"""|#.*$)|(\b(?:class|def|from|import|True|False|self|return|if|else|is|None|not|getattr|hasattr|super)\b)|(\b(?:models|AuditFieldsModel|ActiveManager|Manager|get_queryset|EmailUser|ContextVar|SimpleNamespace|BasePermission|FeatureFlag|ForeignKey|property|setter)\b)/gm,
      (m, s, k, c) => {
        if (s) return `<span class="${s[0]==='#'?'code-cm':'code-st'}">${m}</span>`;
        if (k) return `<span class="code-kw">${m}</span>`;
        if (c) return `<span class="code-cl">${m}</span>`;
        return m;
      });
  };

  function play() {
    if (!el) return;
    let out = code.slice(0, line).join("\n");
    if (line < code.length) {
      out += (line > 0 ? "\n" : "") + code[line].substring(0, char++);
      el.innerHTML = highlight(out);
      if (char > code[line].length) { line++; char = 0; setTimeout(play, 150); }
      else setTimeout(play, 35);
    } else {
      setTimeout(() => { el.innerHTML = ""; line = char = 0; play(); }, 5000);
    }
  }

  document.readyState === "complete" ? play() : window.addEventListener("load", play);
})();