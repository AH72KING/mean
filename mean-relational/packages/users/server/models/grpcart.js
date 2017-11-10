'use strict';
/**
	* Group Cart Model
	*/
module.exports = function(sequelize, DataTypes,models) {
	var Grpcart = sequelize.define('Grpcart',
		{
			grp_cartId: {
				type: DataTypes.INTEGER(11),
				primaryKey: true,
				allowNull: false,
			    autoIncrement: true
			},	
			COUNT: DataTypes.INTEGER(11),
			STATUS: DataTypes.STRING,
			owner_username: DataTypes.STRING,
			member_count: DataTypes.INTEGER(11),
			current_total: DataTypes.FLOAT(11),
			currency: DataTypes.STRING,
			createtime: DataTypes.DATE,
			owner_userId: {
			    type: DataTypes.INTEGER(11),
			    references:{ model: 'User', key: 'USERID' } 
			  },
			privacy: DataTypes.STRING
		},
		{
			tableName: 'groupcart',
			associate: function(models) {
				console.log(models);
				//Grpcart.belongsTo(models.User);
			}
		}		
	);

	return Grpcart;
};