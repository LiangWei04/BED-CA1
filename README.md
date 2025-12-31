# Starter Repository for Assignment
You are required to build your folder structures for your project.

1️⃣ Project Overview (what & why)
Project Title

Basketball Wellness & Gacha System

Description

- A RESTful backend application that combines a wellness challenge system with a basketball-themed gacha and PvE progression mechanic. Users earn points and tickets by completing wellness challenges, summon basketball players via banners, build a fixed 5-man team, and progress through PvE levels gated by team strength.


2️⃣ Core Features (what it can do)


Wellness System

- Create, update, and delete wellness challenges

- Users can complete challenges and earn points

- Completing challenges awards summon tickets

Gacha System

- Summon banners with configurable cost

- Rarity-based probability (Common → Legendary)

- Banner-specific summon pools

- Summoned players are stored in user roster

Team System

- Users build a fixed 5-man team

- Team selection enforces player ownership

- Team composition affects match outcomes

PvE Campaign

- 10 fixed levels with predefined opponent teams

- Match outcome based on team power comparison

- First-clear rewards and repeat-play diminishing rewards

- Progression is gated by winning


3️⃣ Tech Stack (how it’s built)

- Backend: Node.js + Express

- Database: MySQL

- Architecture: MVC (Routes → Controllers → Models)

- Security: Parameterized SQL queries

- Game Logic: Server-side probability and progression rules


4️⃣ Database Design Summary

- User stores player progression and resources

- WellnessChallenge and UserCompletion manage wellness tracking

- BasketballPlayer stores player metadata (rarity, power)

- UserRoster represents ownership (many-to-many)

- UserTeam stores active fixed 5-man lineup

- SummonBanner and BannerPlayer define summon pools

- Level and LevelOpponent define PvE campaign

- MatchHistory tracks results and rewards


5️⃣ API Overview

Main Endpoints

/users – manage users

/players - retrieve basketball player catalog

/challenges – wellness challenges

/banners - banners details 

/banners/summon – gacha summoning

/users/:id/team – team management

/levels/:id/play – PvE matches

/matches - display match histories


6️⃣ Game Logic Explanation

Summoning Probability
- Rarity is determined by mapping a random value to predefined probability intervals (Common, Rare, Epic, Legendary). The final player is randomly selected from the banner’s eligible pool.


Match Outcome
- PvE match results are determined using a probability function based on the power difference between the user team and the significantly higher chance to win, ensuring progression is gated by roster improvement rather than repeated retries.


Reward Control
- Repeat wins on the same level apply diminishing rewards to prevent farming and encourage progression.


7️⃣ How to Run the Project (mandatory)

1. Clone the repository
2. Install dependencies (npm install)
- mysql2
- nodemon
- express
- dotenv
3. Import the SQL schema into MySQL
4. Configure database credentials
5. Start the server (npm start)

8️⃣ Assumptions & Limitations (this shows maturity)

Authentication is not implemented (out of CA1 scope)

PvE opponents are fixed for balance and testing clarity

No PvP mode implemented

Probabilities are server-controlled and not user-configurable


9️⃣ Reflection (short, but important)

This project reinforced the importance of database normalization, transactional consistency, and separating game logic from persistence. Designing probability-based systems also highlighted the need to balance randomness with deterministic progression.




The following shows the logical project structure.
### Folder Responsibilities
- configs/ – Database schema and initialisation scripts
- controllers/ – Request handling and business logic
- models/ – Database access layer
- routes/ – API endpoint definitions
- services/ – Shared services (e.g. database connection)

.
├── .env
├── index.js
├── package.json
├── package-lock.json
└── src/
    ├── configs/
    │   ├── createSchema.js
    │   └── initTables.js
    ├── controllers/
    │   ├── bannerController.js
    │   ├── challengeController.js
    │   ├── completionController.js
    │   ├── levelController.js
    │   ├── matchController.js
    │   ├── playerController.js
    │   └── userController.js
    ├── models/
    │   ├── bannerModel.js
    │   ├── challengeModel.js
    │   ├── completionModel.js
    │   ├── levelModel.js
    │   ├── matchModel.js
    │   ├── playerModel.js
    │   └── userModel.js
    ├── routes/
    │   ├── mainRoutes.js
    │   ├── bannerRoutes.js
    │   ├── challengeRoutes.js
    │   ├── completionRoutes.js
    │   ├── levelRoutes.js
    │   ├── matchRoutes.js
    │   ├── playerRoutes.js
    │   └── userRoutes.js
    ├── services/
    │   └── db.js
    └── app.js

