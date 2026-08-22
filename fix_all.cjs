const fs = require('fs');

// Fix AuthModal missing properties
let auth = fs.readFileSync('src/components/auth/AuthModal.tsx', 'utf8');
auth = auth.replace(
  /lastActive: new Date\(\)\.toISOString\(\),/g,
  `lastActive: new Date().toISOString(),
        verified: false,
        icebreaker: '',`
);
fs.writeFileSync('src/components/auth/AuthModal.tsx', auth);

// Fix DiscoverView genderFilter -> genderFilterAll
let disc = fs.readFileSync('src/components/DiscoverView.tsx', 'utf8');
disc = disc.replace(/t\.genderFilter,/g, 't.genderFilterAll,');
fs.writeFileSync('src/components/DiscoverView.tsx', disc);

// Fix ChefNadjetView ReactPlayer
let chef = fs.readFileSync('src/components/chef-nadjet/ChefNadjetView.tsx', 'utf8');
chef = chef.replace(/\{\/\* @ts-ignore \*\/\}/g, '');
chef = chef.replace(/<ReactPlayer/g, '{/* @ts-expect-error type missing */} <ReactPlayer');
fs.writeFileSync('src/components/chef-nadjet/ChefNadjetView.tsx', chef);

// Fix LanguageContext keys
// They were inserted at the top of the object, maybe that caused an issue?
// Oh, the error says it's missing properties! Wait, did my replace script work?
// Let's check LanguageContext.tsx manually
