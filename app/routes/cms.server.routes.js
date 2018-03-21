var config = require('../../configs/configs');
var globalMethods = require('../../configs/globals');

module.exports = function(app, express){
    var cms = require('../controllers/cms.server.controller');
    var router = express.Router();

    router.post('/insert', globalMethods.checkAuth, cms.insert);
    router.post('/update', globalMethods.checkAuth, cms.update);
    router.post('/delete', globalMethods.checkAuth, cms.delete);

}