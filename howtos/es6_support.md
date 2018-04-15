# ES2015 and ES2016 support

We do not use babel to transpile ES6 code, and for now we do not use features of the ES6, which are not supported by default in node, such as imports. However consider that as of April 2018 (when this was written) a wast majority (99%) of the features of ES2015 and ES2016 are supported in recent versions of node: [https://node.green/](https://node.green/). Thusly, we simply avoid using the import functionality. Instead, commonjs "require"s are used.
