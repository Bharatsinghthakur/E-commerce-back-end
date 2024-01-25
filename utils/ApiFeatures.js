class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // keyword hum query ke lie rakh rhe h
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // for making case insenstive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr }; // objects are passed through reference in javascript;

    // removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // this.query means == product.find()

    // for FILTER PRICING AND RATINGS
    let queryStr = JSON.stringify(queryCopy); //first i change the object into string
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`); // then it is in string

    // now we need to parse the object in parse

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
