const data = (req, res, next) => {
	res.renderWithData = function(view, model, data) {
		res.render(view, model, function(err, viewString) {
			data.view = viewString;
			res.json(data);
		});
	};
	next();
};
