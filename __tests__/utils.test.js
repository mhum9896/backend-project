const { articleData } = require("../db/data/test-data");
const {
  convertTimestampToDate,
  articleRef
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("articleRef", () => {
  test("should return empty object when passed empty array", () => {
    const input = []
    const result = articleRef(input)
    expect(result).toEqual({})
  })
  test('should return an object containing single key and value when passed an array of length 1', () => {
    const input = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }]
    const result = articleRef(input)
    expect(result).toEqual({
      'Living in the shadow of a great man': 1
    })
  })
  test('should return a lookup object with multiple keys and values when passed an array of multiple article objects', () => {
    const input = [
      {
        article_id: 10,
        title: 'Seven inspirational thought leaders from Manchester UK',
        topic: 'mitch',
        author: 'rogersop',
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: '2020-05-14T04:15:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      {
        article_id: 11,
        title: 'Am I a cat?',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
        created_at: '2020-01-15T22:21:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }
    ]
    const result = articleRef(input)
    expect(result).toEqual({
      'Seven inspirational thought leaders from Manchester UK': 10,
      'Am I a cat?': 11
    })
  })
})