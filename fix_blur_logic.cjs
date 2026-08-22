const fs = require('fs');
let code = fs.readFileSync('src/components/PrivateChatView.tsx', 'utf8');

const targetToReplace = `  const currentMessages = activeUser ? chats[activeUser.id] || [] : [];`;
const replacement = `  const currentMessages = activeUser ? chats[activeUser.id] || [] : [];
  const messageCount = currentMessages.length;
  const isUnlocked = currentUser.isPremium || messageCount >= 10;
  const blurClass = isUnlocked ? '' : messageCount >= 5 ? 'blur-[3px]' : 'blur-[8px]';`;

if (code.includes(targetToReplace)) {
  code = code.replace(targetToReplace, replacement);
  fs.writeFileSync('src/components/PrivateChatView.tsx', code);
  console.log('Fixed blur logic');
} else {
  console.log('Target not found!');
}
