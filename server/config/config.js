/**
 * @author Yan Li
 * @company tantan
 * @Description:
 * parser.js: stage model and ab test provision, review, retrieve and rollback on HBase
 * parserPro.js: production model and ab test provision, review, retrieve and rollback on HBase
 * redisParser.js: stage model and ab test provision, review, retrieve and rollback on Redis
 * redisParserPro.js: production model and ab test provision, review, retrieve and rollback on Redis
 * historyScan.js: production model table list and ab test list history
 * send-email.js: production email sending (whole AI team)
 * stage-send-email.js: stage email sending (currently Yan and Zuxiang included online, but code change to liumeng)
 *
 * app.js: control and add new routers
 */

let config = {

  //for parser (model/ab test)   Stage
  stage_host:'localhost',
  stage_port: 8010,

  //for parserPro (model/ab test) and historyScan    Production
  production_host: 'localhost',
  production_port: 20550,

  //for redisParser      Stage
  redis_stage_host: '127.0.0.1',
  redis_stage_port: 8379,
  redis_stage_password: 'redis-ms.user',

  //for redisParserPro   Production
  redis_production_host: '127.0.0.1',
  redis_production_port: 8379,
  redis_production_password: 'redis-ms.user'

};




module.exports = config;
