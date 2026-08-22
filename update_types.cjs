const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('hasBlueBadge?: boolean;')) {
  code = code.replace(
    /isOnline: boolean;/g,
    `isOnline: boolean;
  hasBlueBadge?: boolean;
  isPremium?: boolean;
  badges?: string[];
  marriageIntentions?: string;
  videoPresentation?: string;`
  );
  fs.writeFileSync('src/types.ts', code);
}
