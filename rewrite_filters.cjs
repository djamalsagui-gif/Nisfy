const fs = require('fs');
let code = fs.readFileSync('src/components/DiscoverView.tsx', 'utf8');

const startIdx = code.indexOf('const filteredUsers = useMemo(() => {');
const endIdx = code.indexOf('}, [', startIdx);
const fullEndIdx = code.indexOf(');', endIdx) + 2;

if (startIdx !== -1 && endIdx !== -1) {
  const newFilterLogic = `const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Exclude current user and blocked
      if (u.id === currentUser.id) return false;
      if (currentUser.blockedUsers && currentUser.blockedUsers.includes(u.id)) return false;
      
      // Gender
      if (discoveryFilters.gender !== 'all' && u.gender !== discoveryFilters.gender) return false;
      
      // Wilaya
      if (discoveryFilters.wilaya !== 'all') {
        if (u.wilayaCode !== discoveryFilters.wilaya) return false;
      }
      
      // Age
      if (u.age < discoveryFilters.ageMin || u.age > discoveryFilters.ageMax) return false;
      
      // Education
      if (discoveryFilters.educationLevel !== 'all') {
        if (u.educationLevel !== discoveryFilters.educationLevel) return false;
      }
      
      return true;
    });
  }, [allUsers, currentUser.id, currentUser.blockedUsers, discoveryFilters]);`;

  code = code.substring(0, startIdx) + newFilterLogic + code.substring(fullEndIdx);
  fs.writeFileSync('src/components/DiscoverView.tsx', code);
}
