# This was made based off the figma diagram that was shared on 2025-03-29 by Priyal, Vaidehi and Mohul
# How to run
```
cd 2025-03-29-figma-to-expo
```
create .env.dev.local and
- add EXPO_PUBLIC_API="your IP"/api/
- add EXPO_PUBLIC_TOKEN="your token here"
```
npm install
npm run start:dev
```

#Todo
- test syncing
- implement proper scoring system
- add login
- add guest mode
- implement leaderbard using totalScoreHistory, and add its mongo counterpart
- syncing of totalScoreHistores across multiple devices, requires server side processing to merge inconsistencies
- achievements and badges
- something else I am forgetting