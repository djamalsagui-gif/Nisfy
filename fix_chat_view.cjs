const fs = require('fs');
let code = fs.readFileSync('src/components/PrivateChatView.tsx', 'utf8');

// Also make sure to update the type of chat avatar in the Contacts list to use blur
// I already replaced it, let's see if there are syntax errors
