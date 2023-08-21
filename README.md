# HAFFA CLI

This is a command-line program for running various tasks related to Haffa.

Most commands require AWS credentials to be active in the running environment. An easy way to do this is to use [aws-vault](https://github.com/99designs/aws-vault).

## Installation

Run `yarn install`. Project requires Node 18 or later.

## Environment

Some environment variables are needed for certain tasks.
Copy `.env.example` to `.env` and edit the placeholders.

## Usage

Run `yarn start` to list all available commands.

Run `yarn start <command> [parameters]` to run commands.

See each command's help (`yarn start <command> --help`) for more info.
