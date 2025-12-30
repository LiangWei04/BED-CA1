
const pool = require("../services/db");

const SQLSTATEMENT = `
  DROP DATABASE IF EXISTS bed_basketball_wellness;
  CREATE DATABASE bed_basketball_wellness;
  USE bed_basketball_wellness;
  

  CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    points INT DEFAULT 0,
    tickets INT DEFAULT 0,
    current_level INT DEFAULT 1
  );
  
  CREATE TABLE WellnessChallenge (
    challenge_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    description TEXT NOT NULL,
    points INT NOT NULL,
    CONSTRAINT fk_challenge_creator
      FOREIGN KEY (creator_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
  );
  
  CREATE TABLE UserCompletion (
    completion_id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    user_id INT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_completion_challenge
      FOREIGN KEY (challenge_id) REFERENCES WellnessChallenge(challenge_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_completion_user
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
  

  CREATE TABLE BasketballPlayer (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rarity ENUM('Common','Rare','Epic','Legendary') NOT NULL,
    archetype ENUM('Shooter','Defender','Playmaker') NOT NULL,
    era ENUM('90s','00s','Modern') NOT NULL,
    power_value INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE SummonBanner (
    banner_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost_points INT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1
  );
  
  CREATE TABLE BannerPlayer (
    banner_id INT NOT NULL,
    player_id INT NOT NULL,
    PRIMARY KEY (banner_id, player_id),
    CONSTRAINT fk_bp_banner
      FOREIGN KEY (banner_id) REFERENCES SummonBanner(banner_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_bp_player
      FOREIGN KEY (player_id) REFERENCES BasketballPlayer(player_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
  

  CREATE TABLE UserRoster (
    roster_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    player_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_roster_user
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,

    CONSTRAINT fk_roster_player
      FOREIGN KEY (player_id) REFERENCES BasketballPlayer(player_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,

    CONSTRAINT uq_user_player
      UNIQUE (user_id, player_id),

    INDEX idx_roster_user (user_id),
    INDEX idx_roster_player (player_id)

  );
  
  CREATE TABLE UserTeam (
    user_id INT NOT NULL,
    slot TINYINT NOT NULL,         
    player_id INT NOT NULL,
    PRIMARY KEY (user_id, slot),
    CONSTRAINT fk_team_user
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_team_player
      FOREIGN KEY (player_id) REFERENCES BasketballPlayer(player_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
  );
  

  CREATE TABLE Level (
    level_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recommended_power INT NOT NULL,
    first_clear_reward INT NOT NULL,
    repeat_reward INT NOT NULL
  );
  
  CREATE TABLE LevelOpponent (
    level_id INT NOT NULL,
    slot TINYINT NOT NULL,         
    player_id INT NOT NULL,
    PRIMARY KEY (level_id, slot),
    CONSTRAINT fk_lo_level
      FOREIGN KEY (level_id) REFERENCES Level(level_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_lo_player
      FOREIGN KEY (player_id) REFERENCES BasketballPlayer(player_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
  );
  
  CREATE TABLE UserLevelProgress (
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    cleared TINYINT(1) NOT NULL DEFAULT 0,
    cleared_at DATETIME NULL,
    PRIMARY KEY (user_id, level_id),
    CONSTRAINT fk_ulp_user
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_ulp_level
      FOREIGN KEY (level_id) REFERENCES Level(level_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
  
  CREATE TABLE UserLevelDaily (
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    play_date DATE NOT NULL,
    repeat_wins_count INT NOT NULL DEFAULT 0,
    loss_claimed TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, level_id, play_date),
    CONSTRAINT fk_uld_user
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_uld_level
      FOREIGN KEY (level_id) REFERENCES Level(level_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
  
  CREATE TABLE MatchHistory (
    match_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    user_score INT NOT NULL,
    opp_score INT NOT NULL,
    result ENUM('WIN','LOSE') NOT NULL,
    reward_points INT NOT NULL,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_match_user
      FOREIGN KEY (user_id) REFERENCES User(user_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_match_level
      FOREIGN KEY (level_id) REFERENCES Level(level_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    INDEX idx_match_user_date (user_id, played_at)
  );
  

  
  CREATE TABLE SynergyRule (
    rule_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    buff_type ENUM('TEAM_POWER_MULT') NOT NULL,
    buff_value DECIMAL(6,3) NOT NULL  
  );
  
  CREATE TABLE SynergyRuleMember (
    rule_id INT NOT NULL,
    player_id INT NOT NULL,
    PRIMARY KEY (rule_id, player_id),
    CONSTRAINT fk_srm_rule
      FOREIGN KEY (rule_id) REFERENCES SynergyRule(rule_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT fk_srm_player
      FOREIGN KEY (player_id) REFERENCES BasketballPlayer(player_id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
  );

  CREATE TABLE SynergyRuleCondition (
    rule_id INT NOT NULL,
    condition_type ENUM('ARCHETYPE','ERA') NOT NULL,
    condition_value VARCHAR(32) NOT NULL,
    required_count TINYINT NOT NULL,
    PRIMARY KEY (rule_id, condition_type, condition_value),
    CONSTRAINT fk_src_rule
      FOREIGN KEY (rule_id) REFERENCES SynergyRule(rule_id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );

  INSERT INTO User (username) VALUES
  ('liam'),
  ('amanda'),
  ('weijie'),
  ('sarah'),
  ('gareth');
  

  INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
  (1, 'Sleep like a boss – Get 7+ hours of sleep', 10),
  (1, 'Stairs over elevator – Take the stairs today', 20),
  (2, 'Digital detox – No phone for 1 hour', 10),
  (2, 'Touch grass IRL – 15-minute walk outside', 10),
  (2, 'IRL > DMs – Talk to a friend face-to-face', 20),
  (3, 'Declutter your chaos – Clean your desk/room', 20),
  (3, 'Hydration check – Drink 6 cups of water', 10),
  (4, 'Focus sprint – 25 minutes deep work', 20),
  (5, 'Early bird – Wake up before 7:00am', 20);
  
  INSERT INTO UserCompletion (challenge_id, user_id, details) VALUES
  (2, 1, 'Slept early and felt better in class.'),
  (2, 2, 'Took stairs all day, legs dying but worth.'),
  (4, 3, 'Walked after dinner, cleared my mind.'),
  (6, 1, 'Clean desk = clean brain.'),
  (8, 4, 'Finished a lab with one solid focus sprint.');

  INSERT INTO BasketballPlayer ( name, rarity, archetype, era, power_value) VALUES
  ( 'Patrick Beverley', 'Common', 'Defender',  'Modern', 10),
  ( 'Danny Green',      'Common', 'Shooter',   'Modern', 10),
  ( 'Ricky Rubio',      'Common', 'Playmaker', 'Modern', 10),
  ( 'Taj Gibson',       'Common', 'Defender',  '00s',    10),
  ( 'J.J. Redick',      'Common', 'Shooter',   '00s',    10),
  ( 'Derek Fisher',     'Common', 'Playmaker', '00s',    10),
  ( 'Bruce Bowen',      'Common', 'Defender',  '90s',    10),
  ( 'John Starks',      'Common', 'Shooter',   '90s',    10),
  ( 'Muggsy Bogues',    'Common', 'Playmaker', '90s',    10),
  ( 'Shane Battier',    'Common', 'Defender',  'Modern', 10),
  ( 'Kyle Korver',      'Common', 'Shooter',   'Modern', 10),
  ( 'Andre Miller',    'Common', 'Playmaker', 'Modern', 10),
  ( 'Tayshaun Prince', 'Common', 'Defender',  '00s',    10),
  ( 'Robert Horry',    'Common', 'Shooter',   '00s',    10),
  ( 'Jason Williams',  'Common', 'Playmaker', '00s',    10),
  ( 'Horace Grant',    'Common', 'Defender',  '90s',    10),
  ( 'Glenn Robinson',  'Common', 'Shooter',   '90s',    10),
  ( 'Nick Van Exel',   'Common', 'Playmaker', '90s',    10),
  ( 'Trevor Ariza',    'Common', 'Defender',  'Modern', 10),
  ( 'Lou Williams',    'Common', 'Shooter',   'Modern', 10),

  ( 'Peja Stojaković',  'Rare', 'Shooter',   'Modern', 16),
  ( 'Mike Conley',     'Rare', 'Playmaker', 'Modern', 16),
  ( 'Jrue Holiday',    'Rare', 'Defender',  'Modern', 16),
  ( 'Glenn Rice',      'Rare', 'Shooter',   '00s',    16),
  ( 'Lamar Odom',      'Rare', 'Playmaker', '00s',    16),
  ( 'Rasheed Wallace', 'Rare', 'Defender',  '00s',    16),
  ( 'Latrell Sprewell','Rare', 'Shooter',   '90s',    16),
  ( 'Kevin Johnson',   'Rare', 'Playmaker', '90s',    16),
  ( 'Charles Oakley',  'Rare', 'Defender',  '90s',    16),
  ( 'Jamal Crawford',  'Rare', 'Shooter',   'Modern', 16),
  ( 'Baron Davis',     'Rare', 'Playmaker', 'Modern', 16),
  ( 'Andrew Wiggins',  'Rare', 'Defender',  'Modern', 16),

  ( 'LeBron James',    'Epic', 'Playmaker', '00s', 31),
  ( 'Kevin Durant',    'Epic', 'Playmaker', 'Modern', 23),
  ( 'Kobe Bryant',     'Epic', 'Defender',  '00s',    23),
  ( 'Shaquille O’Neal','Epic', 'Shooter',   '00s',    23),
  ( 'Hakeem Olajuwon', 'Epic', 'Playmaker', '90s',    23),
  ( 'Charles Barkley', 'Epic', 'Defender',  '90s',    23),

  ( 'Michael Jordan',  'Legendary', 'Shooter',   '90s', 31),
  ( 'Stephen Curry',   'Legendary', 'Shooter',   'Modern', 23);

  

  INSERT INTO SummonBanner (name, cost_points) VALUES
  ('Standard Banner', 50),
  ('90s Classics (Rate-Up)', 60);
  
  INSERT INTO BannerPlayer (banner_id, player_id)
  SELECT 1, player_id FROM BasketballPlayer;
  
  INSERT INTO BannerPlayer (banner_id, player_id)
  SELECT 2, player_id FROM BasketballPlayer;
  

  INSERT INTO Level (level_id, name, recommended_power, first_clear_reward, repeat_reward) VALUES
  (1,  'Rookie Court',     55,  28,  7),
  (2,  'Streetball Start', 65,  36,  9),
  (3,  'Handle Check',     70,  44, 11),
  (4,  'Midrange Trial',   80,  52, 13),
  (5,  'Paint Pressure',   85,  60, 15),
  (6,  'Fast Break',       95,  68, 17),
  (7,  'Playoff Push',    105,  76, 19),
  (8,  'Elite Eight',     112,  84, 21),
  (9,  'Final Four',      120,  92, 23),
  (10, 'Championship',    128, 100, 25);
  
  INSERT INTO LevelOpponent (level_id, slot, player_id) VALUES
  (1,1,1),(1,2,2),(1,3,3),(1,4,4),(1,5,5),
  (2,1,6),(2,2,7),(2,3,8),(2,4,9),(2,5,21),
  (3,1,10),(3,2,11),(3,3,12),(3,4,13),(3,5,22),
  (4,1,14),(4,2,15),(4,3,16),(4,4,23),(4,5,24),
  (5,1,17),(5,2,18),(5,3,19),(5,4,25),(5,5,26),
  (6,1,20),(6,2,1),(6,3,27),(6,4,28),(6,5,29),
  (7,1,2),(7,2,3),(7,3,30),(7,4,31),(7,5,33),
  (8,1,4),(8,2,21),(8,3,24),(8,4,32),(8,5,34),
  (9,1,5),(9,2,26),(9,3,29),(9,4,35),(9,5,36),
  (10,1,6),(10,2,30),(10,3,32),(10,4,37),(10,5,38);
  
  INSERT INTO SynergyRule (name, buff_type, buff_value)
  VALUES ('3 Shooters', 'TEAM_POWER_MULT', 1.060);
  SET @rule_id = LAST_INSERT_ID();
  INSERT INTO SynergyRuleCondition (rule_id, condition_type, condition_value, required_count)
  VALUES (@rule_id, 'ARCHETYPE', 'Shooter', 3);

  INSERT INTO SynergyRule (name, buff_type, buff_value)
  VALUES ('4x 90s Era', 'TEAM_POWER_MULT', 1.080);
  SET @rule_id = LAST_INSERT_ID();
  INSERT INTO SynergyRuleCondition (rule_id, condition_type, condition_value, required_count)
  VALUES (@rule_id, 'ERA', '90s', 4);
  
  -- Splash Duo
  INSERT INTO SynergyRule (name, buff_type, buff_value)
  VALUES ('Splash Duo', 'TEAM_POWER_MULT', 1.050);
  SET @splash_rule = LAST_INSERT_ID();

  INSERT INTO SynergyRuleMember (rule_id, player_id)
  VALUES
  (@splash_rule, 21),
  (@splash_rule, 30);

  -- Defense Wall
  INSERT INTO SynergyRule (name, buff_type, buff_value)
  VALUES ('Defense Wall', 'TEAM_POWER_MULT', 1.050);
  SET @defense_rule = LAST_INSERT_ID();

  INSERT INTO SynergyRuleMember (rule_id, player_id)
  VALUES
  (@defense_rule, 26),
  (@defense_rule, 32);

  -- Legend Pair
  INSERT INTO SynergyRule (name, buff_type, buff_value)
  VALUES ('Legend Pair', 'TEAM_POWER_MULT', 1.100);
  SET @legend_rule = LAST_INSERT_ID();

  INSERT INTO SynergyRuleMember (rule_id, player_id)
  VALUES
  (@legend_rule, 39),
  (@legend_rule, 40);

  INSERT INTO UserRoster (user_id, player_id, quantity) VALUES
  (1, 1, 1),
  (1, 2, 1),
  (1, 3, 1),
  (1, 4, 1),
  (1, 5, 1),
  (1, 21, 1),
  (1, 22, 1);
  
  INSERT INTO UserTeam (user_id, slot, player_id) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (1, 3, 3),
  (1, 4, 4),
  (1, 5, 21);
  
  
  SELECT l.level_id, l.name, COUNT(lo.player_id) AS opponent_count
  FROM Level l
  LEFT JOIN LevelOpponent lo ON lo.level_id = l.level_id
  GROUP BY l.level_id, l.name
  ORDER BY l.level_id;
  
  SELECT b.banner_id, b.name, COUNT(bp.player_id) AS pool_size
  FROM SummonBanner b
  LEFT JOIN BannerPlayer bp ON bp.banner_id = b.banner_id
  GROUP BY b.banner_id, b.name
  ORDER BY b.banner_id;

`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully:", results);
  }
  process.exit();
});