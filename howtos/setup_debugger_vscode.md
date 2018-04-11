# debugging in VSCode

1. Install latest Chrome browser.

2. Install debugging extension by launching VS Code Quick Open (Ctrl+P) and running: 
`ext install msjsdiag.debugger-for-chrome`

3. Restart the VS Code studio.

4. Serve the directory that you wish to debug on `http://localhost:10783`. 
In case of `optimization.js` this is the root directory of the library.
For example, you can use `serve` npm package in node.js, or `python3 -m http.server`
in python to serve static files. Simply cd to the directory, and for example
run `serve --port 10783`, after you installed the necessary npm package.

4. Add a new launch configuration to the `.vscode/launch.json` file. This 
will tell VSCode how you want the debugging to run. Put this file into
the `launch.json`:
```
{
    "name": "Launch Chrome debug on localhost:10783",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:10783/index.html",
    "webRoot": "${workspaceFolder}/",
}
```
Make sure that you open the root folder of the library! Otherwise the
`url` of the page could not be matched properly with physical files,
where physical files are located using `webRoot`. In the latter case,
you can get errors like "Breakpoint ignored because generated code
not found".

When I use this, sometimes the Chrome does not break at breakpoints as 
soon as it launches. But then when I press "Restart" button of debugger, 
the breakpoints start to work.

5. By now you should be able to run debugging of your code. Click on
"Debug" view in the VSCode (left most panel in VSCode March 2018)
and select the launch configuration with name same as in `name` variable
of `launch.json`. If everything is ok, by running it you should see
a new instance of Chrome launched. If you put any breakpoints,
the VSCode should break when Chrome reaches any of them.

If you do not see anything launch, try closing existing sessions of Chrome
and trying again.