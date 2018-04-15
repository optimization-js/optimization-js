# I want to use the setup in this library in my project!

Great! Beyond the getting familiar with other .md files in the `howtos` folder, check out this excellent sequence of tutorials:

[https://egghead.io/lessons/javascript-introduction-to-how-to-write-an-open-source-javascript-library](https://egghead.io/lessons/javascript-introduction-to-how-to-write-an-open-source-javascript-library)

The setup in the library, such as CI and unit testing, is largely based on this tutorial. If there will
be any updates to this, it will be stated in this document.

Note: for semantic-release-cli to work properly with your repo, you need to enable TravisCI for this repo first, if you are using TravisCI.

Consider a few comments below.

## Semantic release authentication

Semantic release plugin needs push access to your repo in order to create tags. For that, follow the steps in [this](https://github.com/semantic-release/semantic-release/blob/caribou/docs/recipes/git-auth-ssh-keys.md) document.

## Documentation

You cannot use a library if you do not know how to. Thus documentation is a very important element of any library, including optimization-js of course :). We currently use [https://github.com/jsdoc3/jsdoc](https://github.com/jsdoc3/jsdoc) for documentation. For tutorial on how to make documentation, see here: [http://usejsdoc.org/](http://usejsdoc.org/).