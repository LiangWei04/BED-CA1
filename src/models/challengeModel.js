const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATEMENT = `
    SELECT * FROM WellnessChallenge;`;
    pool.query(SQLSTATEMENT, callback);
}



module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATEMENT = `
        INSERT INTO WellnessChallenge (creator_id, description, points)
        VALUES (?, ?, ?);
        `;
    const VALUES = [data.user_id, data.description, data.points];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateChallengeById = (data, callback) =>
{
    const SQLSTATEMENT = `
        UPDATE WellnessChallenge 
        SET creator_id = ?, description = ?, points = ?
        WHERE challenge_id = ?;
        `;
    const VALUES = [data.user_id, data.description, data.points, data.challenge_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.deleteChallengeById= (data, callback) =>{
    const SQLSTATEMENT = `
        DELETE FROM WellnessChallenge 
        WHERE challenge_id = ?;`;
    VALUES = [data.challenge_id]
    pool.query(SQLSTATEMENT, VALUES, callback)
}