Setup
```
cd "mongo"
npm i
cd "../sql+frontend"
npm i
npx expo install expo@latest
npx expo install --fix
```
To run mongo (need to be in mongo directory)
```
npm run dev
```
To run sql+frontend (need to be in sql+frontend directory)
```
npx expo start
```

To do:
- Implement propper scoring
    - including bonuses for sharing, and low battery motivation
- settings tab
- profile tab
- check that the progess screen is updating on view
- update leaderboard on focus/view
- implement push notifications
- implement guest login
- seperate user accounts on same device
- add sounds