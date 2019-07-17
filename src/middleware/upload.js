const multer = require('multer');
const loader = (size = 5000000, filesFormat = false) => {
	const files = new RegExp(`\\.(${filesFormat})$`);
	return multer({
		limits: {
			fileSize: size
		},
		fileFilter(req, file, callback) {
			if (filesFormat && !file.originalname.match(files)) {
				return callback(new Error('Please upload correct file'));
			}

			callback(undefined, true);
		}
	});
};

const upload = (name, sizeLimit, filesFormat) => {
	const file = loader(sizeLimit, filesFormat);
	return file.single(name);
};

module.exports = upload;
