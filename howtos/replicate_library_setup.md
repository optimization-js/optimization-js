# I want to use the setup in this library in my project!

Great! Beyond the getting familiar with other .md files in the `howtos` folder, check out this excellent sequence of tutorials:
[https://egghead.io/lessons/javascript-introduction-to-how-to-write-an-open-source-javascript-library](https://egghead.io/lessons/javascript-introduction-to-how-to-write-an-open-source-javascript-library)

The setup in the library, such as CI and unit testing, is largely based on this tutorial. If there will
be any updates to this, it will be stated in this document.

Note: for semantic-release-cli to work properly with your repo, you need to enable TravisCI for this repo first, if you are using TravisCI.

Consider a few comments below.

## Semantic release authentication

Semantic release plugin needs push access to your repo in order to create tags. Use this to setup proper access: (this)[https://docs.travis-ci.com/user/environment-variables/#Defining-encrypted-variables-in-.travis.yml]

In case above is not enough, follow the steps in [this](https://github.com/semantic-release/semantic-release/blob/caribou/docs/recipes/git-auth-ssh-keys.md) document. @iaroslav-ai originally tried to set up access with ssh, but this did not work somehow. Stuff started to work when github token was used.

## We use browserify instead of webpack

This seems like a bit easier option compared to webpack. See more [here](http://browserify.org/).

## Distribution of browserify generated browser lib

We use https://unpkg.com/ for this task.

## Travis on PR's

Above instructions set up some secure variables of Travis, which are not accessible for PR's from outside of the repo. This needs to be solved using [this](https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions), in order for other's to be able to make PRs to the repository.

## Documentation

You cannot use a library if you do not know how to. Thus documentation is a very important element of any library, including optimization-js of course :). We currently use [https://github.com/jsdoc3/jsdoc](https://github.com/jsdoc3/jsdoc) for documentation. For tutorial on how to make documentation, see here: [http://usejsdoc.org/](http://usejsdoc.org/).

We use [https://inch-ci.org/](https://inch-ci.org/) for documentation testing. Follow [this](https://inch-ci.org/help/webhook) to set it up for your repository.