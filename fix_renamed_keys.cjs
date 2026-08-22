const fs = require('fs');

function replaceFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/t\.onlineNow/g, 't.online');
  content = content.replace(/t\.profilesCount/g, 't.profilesFound');
  content = content.replace(/t\.genderFilterAll/g, 't.allGenders');
  content = content.replace(/t\.onlineOnly/g, 't.onlyOnline');
  content = content.replace(/t\.noMatchesTitle/g, 't.matchesTitle');
  content = content.replace(/t\.startConversationTip/g, 't.searchConversation');
  fs.writeFileSync(path, content);
}

replaceFile('src/components/CommunityLoungeView.tsx');
replaceFile('src/components/DiscoverView.tsx');
replaceFile('src/components/MatchesView.tsx');
replaceFile('src/components/PrivateChatView.tsx');
replaceFile('src/components/ProfileCard.tsx');

