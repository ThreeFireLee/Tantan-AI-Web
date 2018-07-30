/**
 * @author Yan Li
 * @company tantan
 * @Description:
 * parser.js: stage model and ab test provision, review, retrieve and rollback on HBase
 * parserPro.js: production model and ab test provision, review, retrieve and rollback on HBase
 * historyScan.js: production model table list and ab test list history
 * send-email.js: production email sending (whole AI team)
 * stage-send-email.js: stage email sending (currently Yan and Zuxiang included online)
 *
 * app.js: control and add new routers
 */

let config = {

  //for parser (model/ab test)   Stage
  stage_host:'localhost',
  stage_port: 8010,

  //for parserPro (model/ab test) and historyScan    Production
  production_host: 'localhost',
  // production_port: 20550,
  production_port: 8010

};




module.exports = config;
