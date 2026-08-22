const fs = require('fs');
let code = fs.readFileSync('src/components/DiscoverView.tsx', 'utf8');

// Replace the filter state
const oldStateBlock = `  // Filters state
  const [filterGender, setFilterGender] = useState<'tous' | 'femme' | 'homme' | 'non-binaire'>('tous');
  const [filterCity, setFilterCity] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [onlyMarriage, setOnlyMarriage] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(55);
  const [selectedInterest, setSelectedInterest] = useState('');`;

const newStateBlock = `  // Filters state
  const [discoveryFilters, setDiscoveryFilters] = useState({
    wilaya: 'all',
    ageMin: 18,
    ageMax: 55,
    gender: 'all' as 'all' | 'homme' | 'femme',
    educationLevel: 'all'
  });`;
  
code = code.replace(oldStateBlock, newStateBlock);

// Replace filteredUsers
const filterRegex = /const filteredUsers = useMemo\(\(\) => \{[\s\S]*?return allUsers\.filter\(\(u\) => \{[\s\S]*?return false;\n      \}\n      return true;\n    \}\);\n  \}, \[.*?\]\);/g;

// Fallback regex if the first fails
const fallbackRegex = /const filteredUsers = useMemo\(\(\) => \{[\s\S]*?return allUsers\.filter\(\(u\) => \{[\s\S]*?\}\);\n  \}, \[.*?\]\);/;

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

if (code.match(filterRegex)) {
  code = code.replace(filterRegex, newFilterLogic);
} else if (code.match(fallbackRegex)) {
  code = code.replace(fallbackRegex, newFilterLogic);
}

fs.writeFileSync('src/components/DiscoverView.tsx', code);
