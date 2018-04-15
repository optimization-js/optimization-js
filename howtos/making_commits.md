# How do I make commits to my PR's?

We use semantic release, which means that commit messages should adhere to a particular structure, so that the semantic versioning plugin can parse the commits, and perform automated releasing. For more information on this, please refer here: [https://egghead.io/lessons/javascript-writing-conventional-commits-with-commitizen](https://egghead.io/lessons/javascript-writing-conventional-commits-with-commitizen).

Do not forget to use `npm run build` before you commit in order to ensure that web version of library and documentation are build. Alternatively, use `npm run commitall` to build and commit all the changes.