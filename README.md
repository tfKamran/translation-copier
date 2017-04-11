# translation-copier

[![npm version](https://badge.fury.io/js/translation-copier.svg)](https://badge.fury.io/js/translation-copier)
[![npm downloads](https://img.shields.io/npm/dt/translation-copier.svg)](https://www.npmjs.com/package/translation-copier)

[![NPM](https://nodei.co/npm/translation-copier.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/translation-copier/)

A tool to copy string translations in an Android project from a CSV

## How to use?

Make a CSV of strings in the following format:

![CSV Template](./CSV Template.png)

Let translation copier take control!

    translation-copier ./translated-strings.csv ~/Workspace/MyProject/app/src/main/res

It will copy all the translations to their respective strings.xml files and update the older values if they exist already.
