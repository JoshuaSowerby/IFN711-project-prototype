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
- **Scoring:**
    - ~~Actual score calculated from perfomance~~
        - round score
        - make more intuitive
    - Bonuses
        - ~~Sharing~~ (please say that this will happen)
        - Low battery

- **Progress screen:**
    - Update progess screen on view
    - Crash on view progress screen (is this still occuring?)
        - either due to large history or negative scores
        - ~~prevent negative scores~~ negative socres have been prevented
    - Weekly GravityFit Score graph:
        - Score is increasing on decay, may be using score history table entries 
    - what do the graphs mean?

- **Login & Users:**
    - auto login if token not expired
    - Implement multi user functionality
    - implement guest mode

- **Leaderboard:**
    - update leaderboard on focus/view

- you should not be able to move off exercise screen while exercising
- settings tab
- profile tab
- implement push notifications
- add sounds
- move commonly used styles into styles/common.js