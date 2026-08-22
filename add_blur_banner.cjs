const fs = require('fs');
let code = fs.readFileSync('src/components/PrivateChatView.tsx', 'utf8');

const headerEndRegex = /\{\/\* Active Chat Messages \*\/\}/;
const bannerCode = `
          {/* Progressive Blur Banner */}
          {activeUser && !isUnlocked && (
            <div className="bg-gradient-to-r from-indigo-50 to-rose-50 border-b border-indigo-100 p-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                Échangez encore <strong>{10 - messageCount}</strong> messages pour dévoiler sa photo !
              </span>
            </div>
          )}
          {/* Active Chat Messages */}`;

code = code.replace(headerEndRegex, bannerCode);
fs.writeFileSync('src/components/PrivateChatView.tsx', code);
