const conn = require('../lib/db');

function createOrUpdateStat(activityId, userId, stat, date, done){
    const sql = `SELECT * FROM statistics
    WHERE activityId = ? AND userId = ? and DATE_FORMAT(date, "%m/%d/%Y")= ?`

    conn.query(sql,[activityId,userId,date], function(err,results, fields){
        if(err){
            console.log('Error retrieving stat',err)
        }else{
            if(results.length > 0){
                updateStat(activityId,stat,date,results[0].id, function(result){
                    done(result)
                })
            }else{
                createStat(activityId,userId,stat,date, function(result){
                    done(result)
                })
            }
        }
    })
}
function updateStat(activityId,stat,date,statId, done){
    const sql = `UPDATE statistics SET activityId = ?, stat = ?, date = ? WHERE id = ?`
    const temp = {
        status: "",
        message:""
    }
    const newDate = new Date(date);
    conn.query(sql,[activityId,stat,newDate,statId], function(err,results,field){
        if(err){
            console.log('Error unable to update stat.', err)
            temp.status = "fail";
            temp.message = "Unable to update stat."
            done(temp)
        }
        else{
            temp.status = "success";
            temp.message = "Success updating stat.";
            done(temp)
        }
    })
}

function createStat(activityId,userId,stat,date,done){
    const sql = `INSERT INTO statistics (activityId,userId,stat,date)
    VALUES (?,?,?,?)`
    const temp = {};
    const newDate = new Date(date);
    conn.query(sql,[activityId,userId,stat,newDate],function(err, result, fields){
        if(err){
            console.log('Error unable to create stat.', err)
            temp.status = "fail";
            temp.message = "Unable to create stat."
            done(temp)
        }
        else{
            temp.status = "success";
            temp.message = "Success creating new stat.";
            done(temp)
        }
    })

}

function deleteStat(statId, userId, done){
    const sql = `UPDATE statistics
     SET active = false
     WHERE id = ? and userId = ?`

    conn.query(sql,[statId,userId],function(err, results    , fields){
        if(err || results.changedRows === 0){
            console.log('Error deleting stat', err);
            let temp = {
                status: "fail",
                message: "Unable to delete stat."
            }
            done(temp);
        }
        else{
            let temp = {
                status:"success",
                message:"Stat deleted."
            }
            done(temp);
        }
    })
}
module.exports = {
    createOrUpdateStat,
    deleteStat
}