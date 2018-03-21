// module.exports = require('./env/' + process.env.NODE_ENV + '.js');

module.exports = {
	db: 'mongodb://username:password@10.2.1.49/node_seed_5',
	mongoDBOptions : {
		db: { native_parser: true },
		server: { poolSize: 5 },
		useMongoClient: true,
		user: 'indianic',
		pass: 'indianic@123'
	},
	sessionSecret: 'indNIC2305',
	securityToken: 'indNIC2305',
	baseApiUrl: '/api',
	serverPort: '5036',
    tokenExpiry: 361440, // Note: in seconds! (1 day)
    rootURL: "http://10.2.1.49:5036/",
    pageName:"main/home",
	adminEmails: 'chandrakanta@indianic.com,chandrakanta1@indianic.com,chandrakanta2@indianic.com',
	adminAccess : ['/login','/forgotPassword','/resetPassword','/profile','/editProfile']
};

/*use equisiteDB_dev
db.createUser({user: "indianic",pwd: "indianic@123", roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]})*/
