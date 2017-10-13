'use strict';
/**
	* User Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
    //console.log('exports server user models ');
/*
	var User = sequelize.define('User',
		{
			name: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				unique: true,
				isEmail: true,
				notEmpty: true
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				notEmpty: true
			},
			hashedPassword: DataTypes.STRING,
			provider: DataTypes.STRING,
			salt: DataTypes.STRING,
			facebookUserId: DataTypes.INTEGER,
			twitterUserId: DataTypes.INTEGER,
			twitterKey: DataTypes.STRING,
			twitterSecret: DataTypes.STRING,
			github: DataTypes.STRING,
			openId: DataTypes.STRING
		},
		{
			instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64');
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt){
						return '';
					}
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64,'sha1').toString('base64');
				}
			},
			associate: function(models) {
				//User.hasMany(models.product);
			}
		}*/
	
	var User = sequelize.define('User',
		{
			USERID: {
				type:DataTypes.INTEGER(11),
				primaryKey: true,
				allowNull: false,
			    autoIncrement: true
			},	
			GIVNAME: DataTypes.STRING,
			SURNAME: DataTypes.STRING,
			GENDER: DataTypes.STRING,
			COUNTRY: DataTypes.STRING,
			loc_default: DataTypes.STRING,
			CITY: DataTypes.STRING,
			EMAIL: {
				type: DataTypes.STRING,
				unique: true,
				isEmail: true,
				notEmpty: true
			},
			CONTACT: DataTypes.STRING,
			tc_accepted: DataTypes.STRING,
			USERNAME: {
				type: DataTypes.STRING,
				unique: true,
				notEmpty: true
			},
			PASSWORD: 	DataTypes.STRING,
			secret_q1: 	DataTypes.STRING,
			secret_q2: 	DataTypes.STRING,
			secret_a1: 	DataTypes.STRING,
			secret_a2: 	DataTypes.STRING,
			pwd_email: 	DataTypes.STRING,
			user_img: 	DataTypes.STRING,
			img_loc: 	DataTypes.STRING,
			userType: 	DataTypes.STRING,
			socialId: 	DataTypes.STRING,
			fullName: 	DataTypes.STRING,
			img_loc1: 	DataTypes.STRING,
			img_loc2: 	DataTypes.STRING,
			img_vid: 	DataTypes.STRING,
			tagline: 	DataTypes.STRING,
			about: 		DataTypes.STRING,
			views: 		DataTypes.INTEGER,
			mentions: 	DataTypes.INTEGER,
			purchases: 	DataTypes.INTEGER,
			nickname: 	DataTypes.STRING,
			num_inspired: DataTypes.INTEGER,
			num_collections: DataTypes.INTEGER,
			num_groups: DataTypes.INTEGER,
			lastlogin: 	DataTypes.DATE,
			lastlogout: DataTypes.DATE,
			user_status:DataTypes.INTEGER,
			privacy: 	DataTypes.STRING,
			social_tokens: DataTypes.STRING,
			online: 	DataTypes.INTEGER,
			wizardStatus: DataTypes.INTEGER,
			dateAdded: 	DataTypes.DATE,
			hashedPassword: DataTypes.STRING,
			provider: 	DataTypes.STRING,
			salt: 		DataTypes.STRING,
			facebookUserId: DataTypes.INTEGER,
			twitterUserId: DataTypes.INTEGER,
			twitterKey: DataTypes.STRING,
			twitterSecret: DataTypes.STRING,
			github: 	DataTypes.STRING,
			openId: 	DataTypes.STRING
		},
		{
			instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64');
				},
				authenticate: function(plainText){
					console.log('model user plain text');
					console.log(plainText);
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(PASSWORD, salt) {
					console.log('model user encryptPassword');
					console.log(PASSWORD);
					console.log(salt);
					if (!PASSWORD || !salt){
						return '';
					}
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(PASSWORD, salt, 10000, 64, 'sha1').toString('base64');
				}
			},
			tableName: 'users'
			//,
			/*associate: function(models) {
				User.hasMany(models.product);
			}*/
		}		
	);

	return User;
};
