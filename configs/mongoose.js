config = require('./configs');
mongoose = require('mongoose');
module.exports = function() {
	var db = mongoose.connect(config.db, config.mongoDBOptions).then(
		(success, err) => {
			console.log('MongoDB connected')
		},
		(err) => {
			console.log('MongoDB connection error : ', err)
		});
	// require('../app/models/userProfile.server.model');
	// require('../app/models/investor.server.model');
	// require('../app/models/industries.server.model');
	// require('../app/models/OrganisationType.server.model');
	// require('../app/models/businessProfile.server.model');
	// require('../app/models/investorAcquirerLender.server.model');
	// require('../app/models/company.server.model');
	// require('../app/models/reviewAndRating.server.model');
	// require('../app/models/notification.server.model');
	// require('../app/models/advertiserPlan.server.model');
	// require('../app/models/advisor.server.model');
	// require('../app/models/advertisementmaster.server.model');
	// require('../app/models/invalidAttempes.server.model');
	// require('../app/models/location.server.model');
	// require('../app/models/servicesMaster.server.model');
	// require('../app/models/news.server.model');
	// require('../app/models/businessMaster.server.model');

	return db;
};