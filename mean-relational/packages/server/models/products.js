'use strict';

module.exports = function(sequelize, DataTypes) {

	var product = sequelize.define('product', {
			ProdBrandId: {
				type:DataTypes.INTEGER,
				primaryKey: true
			},
			name: DataTypes.STRING,
			code: DataTypes.STRING,
			min_price: DataTypes.FLOAT(11),
			max_price: DataTypes.FLOAT(11),
			cost_price: DataTypes.FLOAT(11),
			buy_now_price: DataTypes.FLOAT(11),
			currency: DataTypes.STRING,
			specs: DataTypes.TEXT,
			location: DataTypes.TEXT,
			img_loc: DataTypes.TEXT,
			img1: DataTypes.TEXT,
			img2: DataTypes.TEXT,
			img3: DataTypes.TEXT,
			img4: DataTypes.TEXT,
			img5: DataTypes.TEXT,
			features: DataTypes.TEXT,
			dateadded: DataTypes.TEXT,
			vendor_name: DataTypes.TEXT,
			cnt_yells: DataTypes.TEXT,
			position: DataTypes.TEXT,
			rank: DataTypes.TEXT,
			prev_rank: DataTypes.TEXT
		},
		{
		timestamps: false,
		tableName: 'productbrands'

	},
		{
			associate: function(models){
				product.belongsTo(models.User);
			}
		}
	);

	return product;
};
