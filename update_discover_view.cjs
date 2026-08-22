const fs = require('fs');
let code = fs.readFileSync('src/components/DiscoverView.tsx', 'utf8');

// Replace imports
code = code.replace(
  "import { ProfileCard } from './ProfileCard';",
  "import { ProfileCard } from './discovery/ProfileCard';\nimport { MatchingActions } from './discovery/MatchingActions';\nimport { Filters } from './discovery/Filters';"
);

// Replace filter state
code = code.replace(
  "// Filters state",
  `// Filters state
  const [discoveryFilters, setDiscoveryFilters] = useState({
    wilaya: 'all',
    ageMin: 18,
    ageMax: 55,
    gender: 'all' as 'all' | 'men' | 'women',
    educationLevel: 'all'
  });`
);

// We need to find the filtering logic and replace it
const filterLogicRegex = /const filteredUsers = useMemo\(\(\) => \{[\s\S]*?return allUsers\.filter\(\(u\) => \{[\s\S]*?\}\);\s*\}\);/;

const newFilterLogic = `const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Exclude current user and blocked
      if (u.id === currentUser.id) return false;
      
      // Gender
      if (discoveryFilters.gender !== 'all') {
        if (discoveryFilters.gender === 'women' && u.gender !== 'women') return false;
        if (discoveryFilters.gender === 'men' && u.gender !== 'men') return false;
      }
      
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
  }, [allUsers, currentUser.id, discoveryFilters]);`;

code = code.replace(filterLogicRegex, newFilterLogic);

// Replace the inline filters and render Filters modal
const inlineFiltersStart = code.indexOf("{/* Collapsible Filters Drawer */}");
const inlineFiltersEnd = code.indexOf("</div>", code.indexOf("</div>", inlineFiltersStart) + 1); 

// We won't replace inline filters blindly because it's deeply nested. We'll just replace the JSX for the filter drawer with nothing (since it's a modal now)
code = code.replace(/\{\/\* Collapsible Filters Drawer \*\/\}(.|\n)*?(?=\{\/\* Search & Active Filters Bar \*\/\})/m, `
        {showFilters && (
          <Filters 
            filters={discoveryFilters}
            onChange={(key, val) => setDiscoveryFilters(prev => ({...prev, [key]: val}))}
            onClose={() => setShowFilters(false)}
          />
        )}
`);

// Replace ProfileCard render block
const profileCardRegex = /<ProfileCard[\s\S]*?\/>/;
const newProfileCardRender = `<div className="w-full flex flex-col items-center">
              <ProfileCard
                profile={activeCardUser}
                currentUser={currentUser}
              />
              <MatchingActions 
                onPass={handleDislike}
                onLike={() => handleLike(activeCardUser)}
                onSuperLike={() => handleSuperLike(activeCardUser, false)}
                onJasmin={() => handleSuperLike(activeCardUser, true)}
              />
            </div>`;

code = code.replace(profileCardRegex, newProfileCardRender);

fs.writeFileSync('src/components/DiscoverView.tsx', code);
