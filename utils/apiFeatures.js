class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);
    // advanced filtering ( ?fieldName[gte]=fieldName )
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // build query
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // sorting ( ?sort=fieldName (asc) || ?sort=-filedName (desc) )
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replace(',', ' ');
      this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // limiting fields ( ?fields=name, price (show name and price only) || ?fields=-price (do not show price field) )
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query.select(fields);
    } else {
      this.query.select('-__v'); // by default excluding __v field
    }
    return this;
  }

  paginate() {
    // pagination
    const page = this.queryString.page ? this.queryString.page : 1;
    const limit = this.queryString.limit ? this.queryString.limit : 10;
    this.query.skip((page - 1) * limit).limit(Number(limit));
    return this;
  }
}

module.exports = APIFeatures;
