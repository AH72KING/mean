'use strict';
/**
	* User Model
	*/

//var crypto = require('crypto');
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
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
					return bcrypt.genSaltSync(10);//crypto.randomBytes(16).toString('base64');
				},
				authenticate: function(plainText){
					return bcrypt.compareSync(plainText,this.hashedPassword); //this.encryptPassword(plainText, bcrypt.genSaltSync(10)) === this.hashedPassword;
				},
				encryptPassword: function(PASSWORD, salt) {
					salt = bcrypt.genSaltSync(10);
					if (!PASSWORD || !salt){
						return '';
					}
					return bcrypt.hashSync(PASSWORD, salt); //crypto.pbkdf2Sync(PASSWORD, salt, 10000, 64, 'sha1').toString('base64');
				}
			},
			tableName: 'users',
			associate: function(models) {
				//User.hasMany(models.product);
				User.hasOne(models.Grpcart, {foreignKey: 'owner_userId', targetKey: 'USERID'});
			}
		}		
	);

	return User;
};
