'use strict';
/**
	* Login Model
	*/
module.exports = function(sequelize, DataTypes) {
	var Login = sequelize.define('Login',
		{
			loginid: {
				type: DataTypes.INTEGER(11),
				primaryKey: true,
				allowNull: false,
			    autoIncrement: true
			},	
			givname: DataTypes.STRING,
			surname: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			role: DataTypes.STRING,
			business_name: DataTypes.STRING,
			lastlogin: DataTypes.DATE,
			lastlogout: DataTypes.DATE,
			token: DataTypes.TEXT,
			userId: DataTypes.INTEGER(11),
			token_expiry: 	DataTypes.DATE,	
		},
		{
			tableName: 'logins'
		}		
	);

	return Login;
};
