const conn = require('../lib/db');

function getAllActivities(userId, done) {
    const sql = `SELECT id, name , concat("http://localhost:3000/api/activities/" ,id ) as link 
    FROM activities
    WHERE userId = ? and active = true`

    conn.query(sql, [userId], function (err, results, fields) {
        if (err || results.length === 0) {
            console.log('Error retrieving activities', err)
            data = {
                status: "fail",
                message: "Unable to retrieve activities.",
                activities: ""
            }
        } else {
            data = {
                status: "success",
                message: "Current activities",
                activities: results
            }
        }
        done(data);
    })
}
function createActivity(userId, name, done) {
    const sql = `INSERT INTO activities (userId, name) VALUES (?,?)`;
    const data = {
        status: "",
        message: "",
        activity: {
            name: name,
            id: ""
        }
    }
    conn.query(sql, [userId, name], function (err, results, fields) {
        if (err) {
            console.log('Error creating new activity', err);
            data.status = "fail";
            data.message = "Error creating new activity";
            done(data)
        } else {
            data.status = "success",
                data.message = "New activity created.",
                data.activity.id = results.insertId;
            done(data)
        }
    })
}

function getActivity(activityId, userId, done){
    const sql = `SELECT s.id, a.name, stat, DATE_FORMAT(date, "%m/%d/%Y") as date
    FROM activities a
    JOIN statistics s ON a.id = s.activityId
    WHERE  a.id = ? AND a.userid = ? AND s.active = true`
    const data = {
        status: "",
        message: "",
        stats: []
    }
    conn.query(sql,[activityId,userId], function(err, results, fields){
        if(err || results.length === 0){
            console.log('Error retriving activity with stats', err)
            data.status = "fail";
            data.message = "Unable to retrieve activity";
            done(data)
        }else{
            data.status = "success";
            data.message = "Retrieved activity stats."
            data.stats = results;
            done(data);
        }
    })
}
function updateActivity(activityId, userid, name, done){
    const sql = `UPDATE activities SET name = ? WHERE id = ? and userId = ?`
    conn.query(sql,[name,activityId,userid], function(err,results,fields){
        if(err || results.changedRows === 0){
            console.log('Error updating activity', err)
            let temp ={
                status:"fail",
                message: "Unable to update activity."
            }
            done(temp)
        }
        else{
            let temp = {
                status: "success",
                message: "Activity updated."
            }
            done(temp);
        }
    })
}
function deleteActivity(activityId,userid,done){
    const sql = `UPDATE activities a JOIN statistics s ON a.id = s.activityId 
    SET a.active = FALSE,s.active = FALSE
    WHERE a.id = ? AND a.userid = ?`
    conn.query(sql,[activityId,userid],function(err,results,fields){
        if(err || results.changedRows === 0){
            console.log('Error deleting activity', err);
            let temp = {
                status: "fail",
                message: "Unable to delete activity."
            }
            done(temp);
        }
        else{
            let temp = {
                status:"success",
                message:"Activity deleted."
            }
            done(temp);
        }
    })
}
module.exports = {
    createActivity,
    getAllActivities,
    getActivity,
    updateActivity,
    deleteActivity
}