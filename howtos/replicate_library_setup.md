# I want to use the setup in this library in my project!

Great! Beyond the getting familiar with other .md files in the `howtos` folder, check out this excellent sequence of tutorials:

[https://egghead.io/lessons/javascript-introduction-to-how-to-write-an-open-source-javascript-library](https://egghead.io/lessons/javascript-introduction-to-how-to-write-an-open-source-javascript-library)

The setup in the library, such as CI and unit testing, is largely based on this tutorial. If there will
be any updates to this, it will be stated in this document.

Note: for semantic-release-cli to work properly with your repo, you need to enable TravisCI for this repo first, if you are using TravisCI.

We do not use babel to transpile ES6 code, and for now we do not use features of the ES6, which are not supported by default in node, such as imports. However consider that as of April 2018 (when this was written) a wast majority (99%) of the features of ES2015 and ES2016 are supported in recent versions of node: [https://node.green/](https://node.green/). Thusly, we simply avoid using the import functionality. Instead, commonjs "require"s are used.