const express = require('express')
const router = express.Router()
const conn = require('../lib/db')
const activity = require('../models/activity')
const statistics = require('../models/statistics')

/**
 * Show a list of all activities user is tracking, and links to their individual pages
 * METHOD: GET
 * URL: /api/activities
 * RESPONSE: 
 *      status: string,
 *      message: string,
 *      activities: array
 */

router.get('/activities', function (req, res, next) {
    const userId = res.locals.userId;
    activity.getAllActivities(userId, function (response) {
        res.json(response);
    })
})

/**
 * Create a new activity for user to track.
 * METHOD: POST
 * URL: /api/activities
 * BODY PARAMS:
 *      name: string
 * RESPONSE:
 *      status: string,
 *      message: string
 */
router.post('/activities', function (req, res, next) {
    const name = req.body.name;
    const userId = res.locals.userId;
    activity.createActivity(userId, name, function (response) {
        res.json(response);
    })
})

/**
 * Show information about one activity user is tracking, and give back the data recorded for that activity.
 * METHOD: GET
 * URL: /api/activities/{id}
 * URL PARAMS:
 *      id: activity id    
 * RESPONSE:
 *      status: string,
 *      message: string,
 *      stats: array
 */
router.get('/activities/:id', function (req, res, next) {
    const userId = res.locals.userId;
    const activityId = req.params.id;

    activity.getActivity(activityId,userId, function(response){
        res.json(response);
    })
})

/**
 * Update one activity user is tracking, changing name attribute. Does not allow for changing tracked data.
 * METHOD: PUT
 * URL: /api/activities/{id}
 * URL PARAMS:
 *      id: activity id
 * BODY PARAMS:
 *      name: string
 * RESPONSE: 
 *      status: string,
 *      message: string
 */
router.put('/activities/:id', function (req, res, next) {
    const userId = res.locals.userId;
    const activityId = req.params.id;
    const name = req.body.name;
    activity.updateActivity(activityId,userId,name, function(response){
        res.json(response);
    })
})

/**
 * Delete one activity user istracking. This should remove tracked data for that activity as well.
 * METHOD: DELETE
 * URL: /api/activities/{id}
 * URL PARAMS:
 *      id: activity id
 * RESPONSE:
 *      status: string,
 *      message: string
 */	
router.delete('/activities/:id', function(req, res, next){
    const userId = res.locals.userId;
    const activityId = req.params.id;
    activity.deleteActivity(activityId,userId, function(response){
        res.json(response);
    })
})
/**
 * Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
 * METHOD: POST
 * URL: /api/activities/{id}/stats
 * URL PARAMS:
 *      id: activity id
 * BODY PARAMS:
 *      stats: sting,
 *      date: string format = "mm/dd/yyyy"
 * RESPONSE:
 *      status: string,
 *      message: string
 */
router.post('/activities/:id/stats', function(req, res, next){
   const userId = res.locals.userId;
   const activityId = req.params.id;
   const stat = req.body.stat;
   const date = req.body.date;
   statistics.createOrUpdateStat(activityId,userId,stat,date,function(response){
       res.json(response);
   })
})

/**
 * Remove tracked data for a day.
 * METHOD: DELETE
 * URL: /api/stats/{id}
 * URL PARAMS: 
 *      id: stat id
 * RESPONSE:
 *      status:string,
 *      message: string
 */
router.delete('/stats/:id', function(req, res, next){
    const userId = res.locals.userId;
    const statId = req.params.id;
    statistics.deleteStat(statId,userId, function(response){
        res.json(response);
    })
})
module.exports = router