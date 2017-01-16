# Nested Models

If you want to have a nested model class, each nested object should be declared as its own type.

Example:

```js
export type UserModelType {
  name: string,
};

export type GithubIssueModelType {
  author: UserModelType,
  body: string,
  title: string,
}
```

Then you can interact with the generated models like this:

```js
const issue = GithubIssue.fromJS({
  author: {
    name: "kittens"
  },
  title: "Yarn is too fast",
  body: "I can no longer sword-fight while installing dependencies: https://xkcd.com/303/"
});

console.log(issue.author.name); // prints "kittens"

const updatedIssue = issue.setAuthor(issue.author.setName("thejameskyle"));

console.log(updatedIssue.author.name); // prints "thejameskyle"
console.log(issue.author.name); // prints "kittens"
```
