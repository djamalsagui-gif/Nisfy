const fs = require('fs');
let code = fs.readFileSync('src/components/PrivateChatView.tsx', 'utf8');

// Find activeUser definition and add blur logic
const activeUserRegex = /const activeUser = allUsers\.find\(\(u\) => u\.id === activeChatUserId\);/;
if (code.match(activeUserRegex)) {
  const blurLogic = `const activeUser = allUsers.find((u) => u.id === activeChatUserId);
  const activeChatUserMessages = activeChatUserId ? (chats[activeChatUserId] || []) : [];
  const messageCount = activeChatUserMessages.length;
  const isUnlocked = currentUser.isPremium || messageCount >= 10;
  const blurClass = isUnlocked ? '' : messageCount >= 5 ? 'blur-[3px]' : 'blur-[8px]';
`;
  code = code.replace(activeUserRegex, blurLogic);
}

// Replace all instances of `activeUser.avatar` img tags to include the blurClass
// 1. Header avatar
code = code.replace(/className="w-10 h-10 rounded-full object-cover border border-slate-200"/, 'className={`w-10 h-10 rounded-full object-cover border border-slate-200 transition-all duration-1000 ${blurClass}`}');

// 2. Message avatar
code = code.replace(/className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 mb-1"/, 'className={`w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 mb-1 transition-all duration-1000 ${blurClass}`}');

// 3. Typing avatar
code = code.replace(/className="w-6 h-6 rounded-full object-cover border border-slate-200"/, 'className={`w-6 h-6 rounded-full object-cover border border-slate-200 transition-all duration-1000 ${blurClass}`}');

// 4. Contacts list avatar - we also need to apply blur there based on the contact's message count
// We will apply the logic locally for each contact in the list.
const contactItemRegex = /<img\s*src=\{user\.avatar\}\s*alt=\{user\.pseudo\}\s*referrerPolicy="no-referrer"\s*className="w-12 h-12 rounded-full object-cover border border-slate-200"\s*\/>/g;

code = code.replace(contactItemRegex, (match) => {
  return `{(() => {
                      const contactMsgCount = (chats[user.id] || []).length;
                      const contactIsUnlocked = currentUser.isPremium || contactMsgCount >= 10;
                      const contactBlur = contactIsUnlocked ? '' : contactMsgCount >= 5 ? 'blur-[3px]' : 'blur-[8px]';
                      return (
                        <img
                          src={user.avatar}
                          alt={user.pseudo}
                          referrerPolicy="no-referrer"
                          className={\`w-12 h-12 rounded-full object-cover border border-slate-200 transition-all \${contactBlur}\`}
                        />
                      );
                    })()}`;
});

fs.writeFileSync('src/components/PrivateChatView.tsx', code);
